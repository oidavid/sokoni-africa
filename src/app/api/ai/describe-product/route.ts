import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, category, language = 'en' } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ name: '', description: '', suggestedPrice: { min: 1000, max: 10000 }, error: 'AI not configured' })
    }

    const prompt = `You are helping a market trader write a product listing for their online store.

Look at this product image and write a short listing.

Category: ${category || 'general'}
Market: Nigerian/African emerging market

Respond with ONLY a JSON object, no other text:
{"name":"product name here","description":"2-3 sentence description here","suggestedPrice":{"min":1000,"max":5000}}`

    const mediaTypeMatch = imageBase64.match(/^data:(image\/[\w+]+);base64,/)
    const mediaType = (mediaTypeMatch?.[1] || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    const imageData = imageBase64.replace(/^data:image\/[\w+]+;base64,/, '')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageData } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('API error:', data)
      return NextResponse.json({ name: '', description: '', suggestedPrice: { min: 1000, max: 10000 }, error: data.error?.message || 'API error' })
    }

    const text = data.content?.[0]?.text || ''

    // Extract JSON from response — handle markdown code blocks and extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON in response:', text)
      return NextResponse.json({ name: '', description: text.slice(0, 200), suggestedPrice: { min: 1000, max: 10000 } })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)

  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({
      name: '', description: '',
      suggestedPrice: { min: 1000, max: 10000 },
      error: 'AI unavailable — please type description manually',
    })
  }
}
