import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, category, language = 'en' } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        name: '', description: '',
        suggestedPrice: { min: 1000, max: 10000 },
        error: 'AI not configured',
      })
    }

    const systemPrompt = language === 'pid'
      ? `You are helping Nigerian market traders describe their products. Write in warm Nigerian English. Keep it short (2-3 sentences). Use Naira (₦) for prices.`
      : `You are helping emerging market traders describe their products for an online store. Write clear, professional descriptions that build trust. Keep it concise (2-3 sentences). Suggest prices in Nigerian Naira (₦).`

    const userPrompt = `Look at this product photo and write a product listing.

Category: ${category || 'general'}

Respond ONLY with valid JSON, no markdown, no explanation:
{"name":"Short product name max 50 chars","description":"2-3 sentence product description","suggestedPrice":{"min":1000,"max":5000}}`

    // Detect image media type
    const mediaTypeMatch = imageBase64.match(/^data:(image\/\w+);base64,/)
    const mediaType = (mediaTypeMatch?.[1] || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    const imageData = imageBase64.replace(/^data:image\/\w+;base64,/, '')

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
              source: { type: 'base64', media_type: mediaType, data: imageData },
            },
            { type: 'text', text: userPrompt },
          ],
        }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.content[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)
    return NextResponse.json(result)

  } catch (error) {
    console.error('AI description error:', error)
    return NextResponse.json({
      name: '', description: '',
      suggestedPrice: { min: 1000, max: 10000 },
      error: 'AI unavailable — please type description manually',
    })
  }
}
