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

    const prompt = `You are helping a market trader write a product listing for their online store in an emerging market.

Look at this product image and write a short listing.

Category: ${category || 'general'}

Respond with ONLY valid JSON, no markdown, no extra text:
{"name":"product name","description":"2-3 sentence product description","suggestedPrice":{"min":1000,"max":5000}}`

    const mediaType = (imageBase64.match(/^data:(image\/[\w+]+);base64,/)?.[1] || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    const imageData = imageBase64.replace(/^data:image\/[\w+]+;base64,/, '')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
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
      console.error('Anthropic API error:', JSON.stringify(data))
      return NextResponse.json({ 
        name: '', description: '', 
        error: `API error: ${data.error?.message || response.status}` 
      })
    }

    const text = data.content?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ name: '', description: text.slice(0, 200), suggestedPrice: { min: 1000, max: 10000 } })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)

  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({
      name: '', description: '',
      error: 'AI unavailable — please type description manually',
    })
  }
}
