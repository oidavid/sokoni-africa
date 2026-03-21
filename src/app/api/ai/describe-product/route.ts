import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, category } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 })
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ name: '', description: '', error: 'AI not configured' })
    }

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
            { type: 'text', text: `Look at this product image. Write a short product listing for an online store. Respond with ONLY valid JSON: {"name":"product name","description":"2-3 sentence description","suggestedPrice":{"min":1000,"max":5000}}` },
          ],
        }],
      }),
    })

    const rawText = await response.text()
    console.log('Anthropic response status:', response.status)
    console.log('Anthropic response body:', rawText.slice(0, 500))

    if (!response.ok) {
      return NextResponse.json({ name: '', description: '', error: 'Please type your description manually.' })
    }

    const data = JSON.parse(rawText)
    const text = data.content?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ name: '', description: text.slice(0, 200), suggestedPrice: { min: 1000, max: 10000 } })
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]))

  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({ name: '', description: '', error: 'AI unavailable' })
  }
}
