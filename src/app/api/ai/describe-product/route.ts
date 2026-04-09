import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, category, language = 'en' } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ name: '', description: '', error: 'AI not configured' })
    }

    const isPidgin = language === 'pidgin'

    const systemPrompt = isPidgin
      ? `You are helping Nigerian market traders describe their products for their online store. 
         Write product descriptions in a warm, trustworthy Nigerian style. 
         Include key details a buyer would want to know. Keep it short (2-3 sentences).
         The merchant dey sell for Nigerian market so use Naira (₦) for price suggestions.`
      : `You are helping market traders describe their products for their online store.
         Write clear, professional product descriptions that build buyer trust.
         Include key details (material, size, use case). Keep it concise (2-3 sentences).
         Suggest a realistic price range based on the product.`

    const userPrompt = `Look at this product photo and write a product listing.

Category: ${category || 'general'}

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "name": "Short product name (max 50 chars)",
  "description": "2-3 sentence product description",
  "suggestedPrice": { "min": 1000, "max": 5000 }
}`

    const mediaType = (imageBase64.match(/^data:(image\/[\w+]+);base64,/)?.[1] || 'image/jpeg') as
      'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    const imageData = imageBase64.replace(/^data:image\/[\w+]+;base64,/, '')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageData,
              },
            },
            { type: 'text', text: userPrompt },
          ],
        }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic API error:', JSON.stringify(data))
      return NextResponse.json({
        name: '',
        description: '',
        error: `API error: ${data.error?.message || response.status}`,
      })
    }

    const text = data.content?.[0]?.text || ''

    // Strip any markdown fences if present
    const clean = text.replace(/```json|```/g, '').trim()

    let parsed: { name?: string; description?: string; suggestedPrice?: { min: number; max: number } }
    try {
      parsed = JSON.parse(clean)
    } catch {
      console.error('Failed to parse AI response:', clean)
      return NextResponse.json({ name: '', description: '', error: 'Failed to parse AI response' })
    }

    return NextResponse.json({
      name: parsed.name || '',
      description: parsed.description || '',
      suggestedPrice: parsed.suggestedPrice || null,
    })

  } catch (err) {
    console.error('AI describe error:', err)
    return NextResponse.json({ name: '', description: '', error: 'Internal error' }, { status: 500 })
  }
}
