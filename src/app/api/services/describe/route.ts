import { NextRequest, NextResponse } from 'next/server'

// Common service descriptions - instant, no API call needed
const KNOWN_SERVICES: Record<string, { description: string; price: number; price_display: string }> = {
  'deep tissue massage': { description: 'Firm pressure targeting deep muscle layers to release chronic tension, knots and back pain. Licensed therapist. Very effective for athletes and desk workers.', price: 2000000, price_display: '₦20,000' },
  'hot stone massage': { description: 'Smooth heated basalt stones placed on key points and used to massage deeply. Intensely relaxing — melts muscle tension and stress.', price: 2500000, price_display: '₦25,000' },
  'swedish massage': { description: 'Gentle full-body massage using long strokes and warm oils. Perfect for relaxation, stress relief and first-time massage clients.', price: 1500000, price_display: '₦15,000' },
  'prenatal massage': { description: 'Safe, gentle massage for expectant mothers. Relieves back pain, swelling and pregnancy discomfort. Side-lying position for comfort and safety.', price: 2000000, price_display: '₦20,000' },
  'couples massage': { description: 'Side-by-side massage in the same room for two people. Perfect for date nights, anniversaries and special occasions. Book together.', price: 3500000, price_display: '₦35,000' },
  'sports massage': { description: 'Targeted massage for athletes and active people. Reduces soreness, improves flexibility and speeds post-training recovery.', price: 2000000, price_display: '₦20,000' },
  'aromatherapy massage': { description: 'Relaxing massage using therapeutic essential oils — lavender, eucalyptus and more. Balances the mind, body and emotions deeply.', price: 2500000, price_display: '₦25,000' },
  'reflexology': { description: 'Pressure applied to specific points on the feet linked to body organs and systems. Reduces stress, improves circulation and promotes healing.', price: 1000000, price_display: '₦10,000' },
  'brazilian wax': { description: 'Full Brazilian wax by a trained therapist. Clean, quick and professional. Pre and post-care advice provided. Book in advance.', price: 800000, price_display: '₦8,000' },
  'hot wax': { description: 'Warm wax hair removal service — gentle on sensitive skin. Arms, legs, underarms, face and bikini line available. Long-lasting results.', price: 600000, price_display: '₦6,000' },
  'eyebrow wax': { description: 'Clean eyebrow shaping using warm wax. Precise arch and shape tailored to your face. Long-lasting and neat finish.', price: 200000, price_display: '₦2,000' },
  'lash lift': { description: 'Semi-permanent lash lift that curls and lifts your natural lashes. No extensions needed. Lasts 6–8 weeks. No daily curler required.', price: 800000, price_display: '₦8,000' },
  'lash extensions': { description: 'Individual lash extensions applied one by one for a full, dramatic look. Classic, hybrid and volume sets available. Lasts 3–4 weeks.', price: 1500000, price_display: '₦15,000' },
  'microblading': { description: 'Semi-permanent eyebrow tattooing using fine hair strokes. Natural-looking, fuller brows that last 1–2 years. Touch-up included.', price: 5000000, price_display: '₦50,000' },
  'life coaching': { description: 'One-on-one coaching to help you gain clarity, overcome obstacles and create the life you truly want. Transformational and practical.', price: 2500000, price_display: '₦25,000' },
  "women's empowerment": { description: "Coaching designed for women ready to own their power, break limiting beliefs and build a life on their own terms.", price: 2500000, price_display: '₦25,000' },
  'business coaching': { description: 'Strategic coaching for entrepreneurs and business owners. Define direction, solve problems and grow with confidence.', price: 3500000, price_display: '₦35,000' },
  'career coaching': { description: 'Coaching for professionals ready to level up, change direction or land their dream role. Clarity, strategy and confidence.', price: 2000000, price_display: '₦20,000' },
  'mindset coaching': { description: 'Break through fear, self-doubt and limiting beliefs. Build the mental strength to pursue your goals without holding back.', price: 2000000, price_display: '₦20,000' },
  'group coaching': { description: 'Interactive group coaching for shared learning and peer support. Guided transformation in a community setting.', price: 5000000, price_display: '₦50,000' },
  'vision board workshop': { description: 'Guided workshop to visualise your goals, clarify your vision and create an action-oriented roadmap for your future.', price: 2000000, price_display: '₦20,000' },
  'public speaking': { description: 'Overcome fear of speaking and communicate with confidence and impact. Practical coaching for presentations and everyday life.', price: 2500000, price_display: '₦25,000' },
  'counselling': { description: 'Safe, confidential counselling with a trained professional. A space to talk, process and heal — whatever you are carrying.', price: 2000000, price_display: '₦20,000' },
  'meditation': { description: 'Guided mindfulness and meditation sessions to calm the mind, reduce anxiety and build present-moment awareness.', price: 1500000, price_display: '₦15,000' },
  'meal prep': { description: 'Freshly cooked meals prepared and portioned for the week. You pick the menu — we handle everything. Just reheat and enjoy.', price: 2500000, price_display: '₦25,000' },
  'private chef': { description: 'An experienced chef comes to your home to cook a restaurant-quality dinner for you and your guests.', price: 5000000, price_display: '₦50,000' },
  'babysitting': { description: 'Reliable, caring babysitting for evenings and weekends. Experienced with all ages. Your children will be safe and happy.', price: 500000, price_display: '₦5,000' },
  'nanny': { description: 'Trusted, experienced full-time nanny for daily childcare. Background checked, warm and attentive. Apply via WhatsApp.', price: 1500000, price_display: '₦15,000' },
  'gel polish': { description: 'Long-lasting gel nail polish that cures under UV light. Chip-resistant and high-shine finish that lasts 2–3 weeks.', price: 600000, price_display: '₦6,000' },
  'acrylic nails': { description: 'Acrylic nail extensions in your preferred length and shape. Coffin, almond, square or stiletto. Wide colour range available.', price: 1000000, price_display: '₦10,000' },
  'nail art': { description: 'Creative nail art designs — ombre, French tips, 3D gems, stamping and freehand. Instagram-worthy custom designs available.', price: 800000, price_display: '₦8,000' },
  'threading': { description: 'Precise eyebrow, upper lip and face threading. Fast, clean and gentle. Ideal for sensitive skin. Lasts 2–4 weeks.', price: 200000, price_display: '₦2,000' },
  'haircut': { description: 'Professional haircut and styling. All styles and lengths. Wash and blow-dry included. Walk-ins welcome or book ahead.', price: 300000, price_display: '₦3,000' },
  'balayage': { description: 'Hand-painted balayage highlights for a natural, sun-kissed look. Low maintenance and grows out beautifully. Consultation included.', price: 5000000, price_display: '₦50,000' },
  'highlights': { description: 'Classic foil highlights to brighten and add dimension to your hair. Partial or full highlights available. Toner included.', price: 3000000, price_display: '₦30,000' },
  'gele tying': { description: 'Expert gele tying for weddings, parties and ceremonies. Fan, turban and classic styles. Quick, precise and beautiful.', price: 500000, price_display: '₦5,000' },
}

export async function POST(req: NextRequest) {
  try {
    const { name, category } = await req.json()
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

    const normalised = name.toLowerCase().trim()

    // Check known services first - instant response
    for (const [key, val] of Object.entries(KNOWN_SERVICES)) {
      if (normalised.includes(key) || key.includes(normalised)) {
        return NextResponse.json({ description: val.description, price: val.price, price_display: val.price_display })
      }
    }

    // Fall back to Claude for unknown services
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        messages: [{
          role: 'user',
          content: `Write a single professional 1-2 sentence description for a beauty/wellness service called "${name}" in the ${category || 'beauty'} category. Be specific, benefit-focused and warm. Do not use bullet points. Maximum 30 words. No quotes.`
        }]
      })
    })

    const data = await response.json()
    const description = data.content?.[0]?.text?.trim() || `Professional ${name} service. Contact us via WhatsApp to book your appointment.`

    return NextResponse.json({ description, price: 1000000, price_display: '₦10,000' })
  } catch {
    return NextResponse.json({
      description: `Professional service by a trained specialist. Contact us via WhatsApp to discuss your needs and book an appointment.`,
      price: 1000000,
      price_display: '₦10,000'
    })
  }
}
