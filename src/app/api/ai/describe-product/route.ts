import { NextRequest, NextResponse } from 'next/server'

// AI-powered product description generator
// Takes a product photo (base64) + optional merchant notes
// Returns: name suggestion, description, suggested price range

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, merchantNotes, category, language = 'en' } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_API_KEY) {
      // Return mock data if no API key configured
      return NextResponse.json({
        name: "Quality Product",
        description: "A quality product available for purchase. Contact us on WhatsApp for more details.",
        suggestedPrice: { min: 2000, max: 5000 },
      })
    }

    const systemPrompt = language === 'pid'
      ? `You are helping Nigerian market traders describe their products for their online store. 
         Write product descriptions in a warm, trustworthy Nigerian style. 
         Include key details a buyer would want to know. Keep it short (2-3 sentences).
         The merchant dey sell for Nigerian market so use Naira (₦) for price suggestions.`
      : `You are helping Nigerian market traders describe their products for their online store.
         Write clear, professional product descriptions that build buyer trust.
         Include key details (material, size, use case). Keep it concise (2-3 sentences).
         Suggest prices in Nigerian Naira (₦).`

    const userPrompt = `Look at this product photo and write a product listing for a Nigerian market trader's online store.
    
Category: ${category || 'general'}
${merchantNotes ? `Merchant notes: ${merchantNotes}` : ''}

Respond ONLY with valid JSON in this exact format:
{
  "name": "Short product name (max 50 chars)",
  "description": "2-3 sentence product description",
  "suggestedPrice": { "min": 1000, "max": 5000 }
}`

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
                media_type: 'image/jpeg',
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            { type: 'text', text: userPrompt },
          ],
        }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.content[0]?.text || ''

    // Parse JSON response
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)
  } catch (error) {
    console.error('AI description error:', error)
    // Graceful fallback — never block the merchant from adding a product
    return NextResponse.json({
      name: "",
      description: "",
      suggestedPrice: { min: 1000, max: 10000 },
      error: "AI unavailable — please type description manually",
    })
  }
}
