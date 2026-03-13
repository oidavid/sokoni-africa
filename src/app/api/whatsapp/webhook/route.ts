import { NextRequest, NextResponse } from 'next/server'

// WhatsApp Cloud API webhook handler
// Handles incoming messages and sends automated order responses

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'sokoni_verify_token'
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ''
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''

// GET: WhatsApp webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified')
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// POST: Incoming WhatsApp messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Extract message data
    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const messages = value?.messages

    if (!messages?.length) {
      return NextResponse.json({ status: 'ok' })
    }

    const message = messages[0]
    const from = message.from // customer's phone number
    const messageType = message.type
    const messageText = messageType === 'text' ? message.text?.body?.toLowerCase() : ''

    console.log(`Received message from ${from}: ${messageText}`)

    // Simple intent detection — in production this calls Claude/OpenAI
    let responseText = ''

    if (messageText.includes('order') || messageText.includes('wan buy') || messageText.includes('i want')) {
      responseText = `Hello! 👋 Thank you for your order interest!\n\nPlease tell me:\n1. Which product do you want?\n2. Your delivery address or will you pickup?\n\nWe accept: Bank transfer, Opay, PalmPay, or Cash on Delivery.\n\n_Powered by Sokoni Africa_`
    } else if (messageText.includes('price') || messageText.includes('how much') || messageText.includes('cost')) {
      responseText = `Hi! 😊 Please visit our online store to see all prices:\n\n👉 sokoni.africa/tropical-market\n\nYou can order directly from there on WhatsApp too! 🛍️`
    } else if (messageText.includes('hi') || messageText.includes('hello') || messageText.includes('good')) {
      responseText = `Hello! Welcome to *Tropical Market* 🌺\n\nWe sell fresh African groceries — yam flour, palm oil, crayfish, egusi, stockfish and more. Lagos delivery available.\n\nShop our full catalogue:\n👉 sokoni.africa/tropical-market\n\nHow can I help you today?\n\n_Reply "order" to start an order_\n_Reply "price" to ask about prices_`
    } else {
      responseText = `Thanks for your message! 😊\n\nVisit our store to see all our products:\n👉 sokoni.africa/tropical-market\n\nOr reply with:\n• *"order"* - to place an order\n• *"price"* - to ask about prices\n\nWe'll get back to you shortly! 🙏`
    }

    // Send response via WhatsApp Cloud API
    if (ACCESS_TOKEN && PHONE_NUMBER_ID) {
      await sendWhatsAppMessage(from, responseText)
    } else {
      console.log('WhatsApp credentials not configured. Message would be:', responseText)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function sendWhatsAppMessage(to: string, text: string) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    }
  )
  if (!response.ok) {
    const err = await response.text()
    console.error('WhatsApp send error:', err)
    throw new Error(`WhatsApp API error: ${err}`)
  }
  return response.json()
}
