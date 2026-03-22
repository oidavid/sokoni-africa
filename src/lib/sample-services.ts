// Sub-category specific service libraries
// Each sub-category key maps to a rich list of services with appropriate images and descriptions

export const SAMPLE_SERVICES_BY_SUBCATEGORY: Record<string, Array<{
  name: string; description: string; price: number; price_display: string; in_stock: boolean; image_url: string
}>> = {

  // ── BEAUTY: MASSAGE ──────────────────────────────────────────────────────
  massage: [
    { name: 'Swedish Relaxation Massage (60 min)', description: 'Gentle full-body Swedish massage to melt away stress and tension. Warm oils, soft music, private room. Perfect for first-timers.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
    { name: 'Deep Tissue Massage (60 min)', description: 'Firm pressure targeting deep muscle layers and chronic tension. Ideal for back pain, stiff neck and muscle knots. Licensed therapist.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&q=80' },
    { name: 'Hot Stone Massage (75 min)', description: 'Smooth heated basalt stones placed along the spine and used in the massage. Deeply relaxing and warming. A true luxury experience.', price: 2500000, price_display: '₦25,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80' },
    { name: 'Prenatal / Pregnancy Massage', description: 'Safe and soothing massage designed for expectant mothers. Relieves back pain, swollen feet and pregnancy tension. Side-lying position.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80' },
    { name: 'Couples Massage (2 persons)', description: 'Side-by-side massage for two people in the same room. Perfect for date nights, anniversaries and special occasions.', price: 3500000, price_display: '₦35,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
    { name: 'Sports & Recovery Massage', description: 'Targeted massage for athletes and active people. Reduces muscle soreness, improves flexibility and speeds up recovery after training.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
    { name: 'Aromatherapy Massage (90 min)', description: 'Full body massage using therapeutic essential oils — lavender, eucalyptus, peppermint and more. Balances the mind and body.', price: 2500000, price_display: '₦25,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80' },
    { name: 'Reflexology (Foot Massage)', description: 'Pressure applied to specific points on the feet linked to organs and body systems. Promotes healing, reduces stress and improves sleep.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80' },
    { name: 'Chair Massage (30 min)', description: 'Quick seated massage targeting neck, shoulders and upper back. Great for office visits, events and busy clients with limited time.', price: 700000, price_display: '₦7,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&q=80' },
    { name: 'Back, Neck & Shoulder Massage', description: 'Focused 45-minute session on the most common tension areas. Relieves headaches, stiffness and upper body pain. Quick and effective.', price: 1200000, price_display: '₦12,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
  ],

  // ── BEAUTY: BRAIDING ─────────────────────────────────────────────────────
  braiding: [
    { name: 'Knotless Box Braids (Full Head)', description: 'Lightweight knotless box braids with no tension on the scalp. Natural-looking roots, lasts 6–8 weeks. Medium or large sizes available.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Cornrows (Simple & Feed-in)', description: 'Classic and feed-in cornrows in various styles. Straight back, side parts and creative patterns. Neat and long-lasting.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Senegalese Twists', description: 'Rope twists using Kanekalon or human hair. Sleek, elegant and low-maintenance style. Lasts up to 8 weeks with care.', price: 1200000, price_display: '₦12,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Passion Twists', description: 'Bohemian-style passion twists using wavy hair. Full, fluffy and gorgeous. A popular choice for a natural, carefree look.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Ghana Weave (Braids)', description: 'Flat feed-in braids lying close to the scalp in elegant patterns. Very neat, versatile and suitable for all occasions.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Fulani Braids', description: 'Braided style inspired by the Fulani people — a central braid with side cornrows and hanging braids. Beads and accessories included.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Hair Wash & Conditioning', description: 'Thorough hair wash with quality shampoo, deep conditioning treatment and blow-dry. Leaves hair clean, soft and healthy.', price: 400000, price_display: '₦4,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
  ],

  // ── BEAUTY: MAKEUP ────────────────────────────────────────────────────────
  makeup: [
    { name: 'Bridal Makeup (Full Glam)', description: 'Complete bridal makeup for your special day. Trial session included. Flawless, long-lasting and camera-ready. Lashes and setting spray included.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' },
    { name: 'Event Makeup (Full Face)', description: 'Full face glam for parties, birthdays, owambe and ceremonies. Natural or dramatic looks available. Lashes included.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' },
    { name: 'Natural / No-Makeup Makeup Look', description: 'Soft, enhanced natural look perfect for everyday, work and casual events. Buildable coverage with a flawless finish.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' },
    { name: 'Gele Tying (Head Tie)', description: 'Expert gele tying for weddings, parties and ceremonies. Fan, turban and classic styles available. Quick and precise.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' },
    { name: 'Airbrush Makeup', description: 'Professional airbrush foundation for a flawless, photo-ready finish. Lightweight, breathable and lasts all day. Perfect for events and photoshoots.', price: 2500000, price_display: '₦25,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' },
    { name: 'Makeup Lesson (1-on-1)', description: 'Personal makeup tutorial tailored to your face shape and skin tone. Learn techniques you can use every day at home.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' },
  ],

  // ── BEAUTY: NAILS ─────────────────────────────────────────────────────────
  nails: [
    { name: 'Gel Manicure', description: 'Long-lasting gel polish manicure. Cured under UV light for a chip-resistant, high-shine finish that lasts 2–3 weeks.', price: 600000, price_display: '₦6,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
    { name: 'Acrylic Nails (Full Set)', description: 'Acrylic nail extensions in your preferred length and shape — coffin, almond, square or stiletto. Colour of your choice.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
    { name: 'Nail Art Design', description: 'Creative nail art — ombre, French tips, 3D designs, gems and stamping. Custom designs also available. Instagram-worthy results.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
    { name: 'Pedicure & Foot Care', description: 'Full pedicure with soak, scrub, cuticle care, nail trim and polish. Leaves your feet soft, clean and beautiful.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
    { name: 'Nail Infill / Refill', description: 'Maintenance fill for grown-out acrylic or gel nails. Keeps your set looking fresh and new. Recommended every 2–3 weeks.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
    { name: 'Nail Removal & Prep', description: 'Safe removal of old gel, acrylic or dip powder. Nails soaked off properly — no damage to natural nail. Ready for a fresh set.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
  ],

  // ── BEAUTY: BARBER ────────────────────────────────────────────────────────
  barber: [
    { name: 'Haircut & Styling', description: 'Precision haircut and styling. Fade, taper, afro shaping, low cuts and more. Clean lines, sharp finish every time.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
    { name: 'Beard Trim & Shape', description: 'Expert beard trimming, shaping and lining. Fade the beard into the haircut for a clean, groomed look.', price: 150000, price_display: '₦1,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
    { name: 'Hot Towel Shave', description: 'Classic straight razor hot towel shave. Softens the beard, opens pores and gives the closest, most comfortable shave possible.', price: 200000, price_display: '₦2,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
    { name: 'Kids Haircut', description: 'Gentle and patient haircuts for boys. We make it fun and stress-free. All styles available.', price: 200000, price_display: '₦2,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
    { name: 'Hair & Beard Colour', description: 'Natural and fashion hair colour for men. Grey blending, full colour and beard dye available. Long-lasting professional products.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
    { name: 'Full Groom Package', description: 'Haircut, beard trim, hot towel and face wash in one session. The complete grooming experience. Popular for special occasions.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  ],

  // ── BEAUTY: SKINCARE ──────────────────────────────────────────────────────
  skincare: [
    { name: 'Deep Cleansing Facial', description: 'Thorough facial cleanse, steam, exfoliation and extraction. Removes blackheads, unclogs pores and leaves skin glowing.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { name: 'Brightening & Glow Facial', description: 'Vitamin C-based treatment that targets dark spots, hyperpigmentation and dull skin. Leaves the complexion bright and even.', price: 1200000, price_display: '₦12,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { name: 'Acne Treatment Facial', description: 'Targeted facial for acne-prone skin. Anti-bacterial cleanse, clay mask, spot treatment and soothing finish. Reduces breakouts.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { name: 'Anti-Ageing Facial', description: 'Collagen-boosting treatment to reduce fine lines, wrinkles and sagging. Firming mask and serum included. Skin looks younger immediately.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { name: 'Body Scrub & Exfoliation', description: 'Full body exfoliation using sugar or salt scrub. Removes dead skin cells, smoothens and softens skin all over. Follow with body oil.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { name: 'Skin Consultation', description: 'One-on-one skin assessment with a skincare specialist. Get a personalised routine and product recommendations for your skin type.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
  ],

  // ── BEAUTY: WIGS ──────────────────────────────────────────────────────────
  wigs: [
    { name: 'Custom Wig Making (Human Hair)', description: 'Full custom wig made with quality human hair. Your choice of length, texture and density. Includes wig cap construction and styling.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa4e4e1?w=400&q=80' },
    { name: 'Frontal Wig Installation', description: 'Lace frontal wig install — glued, sewn or glueless. Seamless hairline blend, baby hair styled. Looks completely natural.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa4e4e1?w=400&q=80' },
    { name: 'Closure Sew-in', description: 'Closure sew-in install. Natural-looking parting, cornrows underneath. Full sew-in with closure piece included.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa4e4e1?w=400&q=80' },
    { name: 'Wig Customisation & Styling', description: 'Take a store-bought wig and make it look custom. Bleach knots, pluck hairline, cut and style. Transforms a basic wig.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa4e4e1?w=400&q=80' },
    { name: 'Wig Repair & Revamp', description: 'Restore a tangled, shedding or damaged wig. Deep condition, detangle, restitch and restyle. Brings your wig back to life.', price: 700000, price_display: '₦7,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa4e4e1?w=400&q=80' },
  ],
}

// Main category-level fallback (used when no sub-category is selected)
export const SAMPLE_SERVICES: Record<string, Array<{
  name: string; description: string; price: number; price_display: string; in_stock: boolean; image_url: string
}>> = {
  home_services: [
    { name: 'House Wiring & Electrical Installation', description: 'Professional electrical wiring for new buildings and renovations. Certified electrician. Safe, clean work. Free inspection included.', price: 2500000, price_display: '₦25,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80' },
    { name: 'Generator Repair & Servicing', description: 'Full generator servicing, fault diagnosis and repair. All brands covered. Fast turnaround.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80' },
    { name: 'Plumbing — Leaks, Pipes & Taps', description: 'Fix leaking pipes, blocked drains, burst taps and toilet faults. Emergency callouts available.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    { name: 'AC Installation & Servicing', description: 'Air conditioner installation, gas recharge and deep cleaning. All brands. Same-day service available.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1629774631753-43b8c4b29f2e?w=400&q=80' },
    { name: 'Painting — Interior & Exterior', description: 'Professional painting for homes, offices and shops. Quality emulsion and gloss paint. Clean finish guaranteed.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80' },
    { name: 'Tiling & Flooring', description: 'Floor and wall tiling for bathrooms, kitchens and living areas. Neat grout lines and precision finish.', price: 3500000, price_display: '₦35,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&q=80' },
    { name: 'Solar Panel Installation', description: 'Solar inverter and panel installation for homes and offices. Free site assessment.', price: 15000000, price_display: '₦150,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80' },
    { name: 'Carpentry — Doors, Furniture & Repairs', description: 'Custom carpentry work. Quality wood. Measured and fitted on-site.', price: 4000000, price_display: '₦40,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80' },
    { name: 'Welding & Metal Fabrication', description: 'Gates, burglary proof, iron doors and custom metal work. Strong welds, quality finish.', price: 3000000, price_display: '₦30,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80' },
    { name: 'General House Repairs', description: 'Fixing cracks, leaking roofs, broken tiles and general maintenance. Honest pricing, no surprises.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
  ],
  auto_services: [
    { name: 'Full Car Service & Oil Change', description: 'Complete car service. All car brands. Genuine parts available.', price: 2500000, price_display: '₦25,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80' },
    { name: 'Car Wash & Interior Cleaning', description: 'Full exterior wash, wax polish and interior vacuum. Your car will shine like new.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&q=80' },
    { name: 'Tyre Repair & Replacement', description: 'Puncture repair, tyre balancing, wheel alignment. Mobile vulcanizer available.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80' },
    { name: 'Brake Pad Replacement', description: 'Quality OEM and aftermarket pads. Test drive after every job.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80' },
    { name: 'Auto Electrical & Diagnostics', description: 'Car electrical faults, battery replacement and computer diagnostics. All makes welcome.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1596731498067-64116a3c1e87?w=400&q=80' },
    { name: 'Panel Beating & Body Repair', description: 'Dent removal, accident repair and spray painting to original colour.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=400&q=80' },
    { name: 'Car Detailing', description: 'Paint correction, clay bar, wax and interior deep clean. Looks brand new.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80' },
    { name: 'Motorcycle Repair & Servicing', description: 'Okada and commercial motorcycle repairs. Engine overhaul, chain replacement. Fast and reliable.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  ],
  beauty_services: [
    { name: 'Hair Braiding (Full Head)', description: 'Professional braiding — box braids, cornrows, knotless braids and twists. Neat parts, clean finish.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { name: 'Makeup — Full Face', description: 'Full face makeup for events, occasions and photoshoots. Natural and glam looks available. Lashes included.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' },
    { name: 'Gel Nails & Nail Art', description: 'Gel manicure, acrylic nails and nail art designs. Long-lasting finish.', price: 600000, price_display: '₦6,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
    { name: "Men's Haircut & Styling", description: 'Fresh cuts, fades, beard trims and hot towel shaves. Clean and precise.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
    { name: 'Wig Making & Installation', description: 'Custom human hair and synthetic wigs made to order. Also closure sew-ins and frontal installs.', price: 2500000, price_display: '₦25,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1560066984-138daaa4e4e1?w=400&q=80' },
    { name: 'Body Massage (60 mins)', description: 'Relaxing full body massage. Swedish, deep tissue and hot stone options. Professional therapist.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
    { name: 'Facial & Skin Treatment', description: 'Deep cleansing facial, exfoliation and brightening treatment. Addresses acne and dark spots.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { name: 'Eyebrow Threading & Shaping', description: 'Precise threading, shaping and tinting. Clean arches that frame your face perfectly.', price: 200000, price_display: '₦2,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80' },
    { name: 'Hair Relaxer & Treatment', description: 'Professional relaxing, deep conditioning and protein treatments. Restore shine and strength.', price: 700000, price_display: '₦7,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
  ],
  education: [
    { name: 'Primary School Home Tutoring', description: 'One-on-one tutoring for primary school pupils. English, Maths, Basic Science. Results guaranteed.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80' },
    { name: 'WAEC & JAMB Exam Prep', description: 'Intensive exam preparation for WAEC, NECO and JAMB. Past question practice included.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=80' },
    { name: 'Computer & Microsoft Office Training', description: 'Learn Word, Excel, PowerPoint and basic computer skills. Certificate on completion.', price: 600000, price_display: '₦6,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
    { name: 'Piano & Music Lessons', description: 'Keyboard and piano for beginners and intermediate. Learn hymns, gospel and contemporary music.', price: 700000, price_display: '₦7,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80' },
    { name: 'English Language & Communication', description: 'Spoken and written English. Build confidence in speaking, writing and business communication.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80' },
    { name: 'Coding for Beginners', description: 'Introduction to programming using Python or web development. Project-based. No experience needed.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80' },
  ],
  health_wellness: [
    { name: 'Home Physiotherapy Visit', description: 'Physiotherapy at your home for pain relief, stroke recovery and injury rehabilitation. Licensed therapist.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80' },
    { name: 'Personal Fitness Training', description: 'One-on-one fitness coaching at home or gym. Weight loss, muscle building and general fitness.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
    { name: 'Nutrition & Diet Consultation', description: 'Professional nutrition advice for weight management, diabetes and general wellness. Personalised meal plans.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80' },
    { name: 'Childcare & Nanny Services', description: 'Experienced nanny and childcare. Full day, half day and occasional care. Background-checked.', price: 1200000, price_display: '₦12,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80' },
    { name: 'Elderly Home Care', description: 'Compassionate home care for elderly family members. Daily check-ins, medication reminders and companionship.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
    { name: 'Mobile Nursing Services', description: 'Wound dressing, injections, drips and post-surgery care at home. Registered nurse. Prompt and professional.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
  ],
  domestic: [
    { name: 'Home Deep Cleaning', description: 'Thorough deep cleaning of your entire home. We bring all equipment and supplies.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
    { name: 'Laundry & Ironing Service', description: 'Wash, dry and iron your clothes. Pick-up and delivery available. 24-hour turnaround.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80' },
    { name: 'Home Cooking Service', description: 'Fresh home-cooked meals prepared in your kitchen. Soups, stews and full meals.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80' },
    { name: 'Pest Control Treatment', description: 'Cockroach, rat, termite and mosquito treatment. Safe chemicals, effective results.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
    { name: 'Weekly House Cleaning', description: 'Regular weekly cleaning to keep your home spotless. Consistent cleaner. Flexible scheduling.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&q=80' },
    { name: 'Office Cleaning Service', description: 'Daily or weekly office and shop cleaning. Before or after business hours. Corporate rates available.', price: 1200000, price_display: '₦12,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
  ],
  events: [
    { name: 'Event Photography', description: 'Professional photography for weddings, birthdays and corporate events. Edited photos within 48 hours.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80' },
    { name: 'Event Videography', description: 'Full event video coverage with cinematic editing. Drone shots available. Delivered on USB and Google Drive.', price: 7000000, price_display: '₦70,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
    { name: 'Catering — Per Head', description: 'Event catering per head. Jollof rice, fried rice, peppersoup and full buffet options. Minimum 20 guests.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80' },
    { name: 'Event Decoration', description: 'Full event decoration including hall draping, floral arrangements, backdrop and centrepieces.', price: 10000000, price_display: '₦100,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80' },
    { name: 'Custom Cake — 2 Tier', description: 'Beautiful custom celebration cakes. Fondant or buttercream. Birthday, wedding and corporate cakes.', price: 2500000, price_display: '₦25,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80' },
    { name: 'DJ Services (4 hours)', description: 'Professional DJ for parties, weddings and corporate events. Quality sound system included.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80' },
    { name: 'MC & Hosting', description: 'Charismatic MC for weddings, birthdays and corporate events. Bilingual. Keeps the crowd alive all night.', price: 3000000, price_display: '₦30,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80' },
  ],
  digital_services: [
    { name: 'Logo Design', description: 'Professional logo design. 3 concepts, unlimited revisions. PNG, JPG and vector formats.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80' },
    { name: 'Phone Screen Repair', description: 'Screen replacement for iPhone, Samsung, Tecno, Infinix. Same-day repair. Genuine parts.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80' },
    { name: 'Laptop Repair & Maintenance', description: 'Screen, battery, keyboard, overheating and software repairs. All brands. Free diagnosis.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
    { name: 'Social Media Management (Monthly)', description: 'Monthly management for Instagram and Facebook. 12 posts, stories and engagement.', price: 3000000, price_display: '₦30,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80' },
    { name: 'CV & Cover Letter Writing', description: 'Professional CV design and cover letter. ATS-optimised. Word and PDF formats. 24-hour turnaround.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80' },
    { name: 'Flyer & Banner Design', description: 'Eye-catching designs for events, promos and businesses. Print and digital formats.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80' },
  ],
  transport: [
    { name: 'Package Delivery — Same Day', description: 'Same-day delivery of documents and parcels within the city. Fast and reliable.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80' },
    { name: 'Driver for Hire (Daily)', description: 'Professional driver for personal or corporate use. Full day hire. Your car or ours.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80' },
    { name: 'Airport Pick-up & Drop-off', description: 'Reliable airport pick-up and drop-off. Flight tracking and meet and greet. Book 24 hours ahead.', price: 1000000, price_display: '₦10,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
    { name: 'School Run Service', description: 'Daily school run for children. Morning pick-up and afternoon drop-off. Safe and punctual.', price: 800000, price_display: '₦8,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80' },
    { name: 'Moving & Relocation Service', description: 'House and office moving. Packing, loading and delivery. Careful handling of valuables.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    { name: 'Bike Courier (Okada) Delivery', description: 'Fast motorcycle delivery for documents, food and parcels. Available 7am–10pm.', price: 150000, price_display: '₦1,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  ],
  agriculture: [
    { name: 'Poultry Farm Consultation', description: 'Expert advice on broiler and layer farming. Farm setup, feed management and disease prevention. On-site visit.', price: 2000000, price_display: '₦20,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80' },
    { name: 'Farm Labour Supply (Daily)', description: 'Experienced farm workers for planting, weeding and harvesting.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80' },
    { name: 'Drip Irrigation Installation', description: 'Design and installation of drip irrigation systems. Water-saving and efficient. Maintenance included.', price: 5000000, price_display: '₦50,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
    { name: 'Tractor Ploughing Service', description: 'Land clearing and ploughing using tractor. Priced per acre. Available for small and large farms.', price: 1500000, price_display: '₦15,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80' },
    { name: 'Fish Farm Setup & Management', description: 'Catfish pond construction, stocking, feed management and harvest planning.', price: 10000000, price_display: '₦100,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&q=80' },
  ],
}

export function getSampleServices(category: string) {
  return SAMPLE_SERVICES[category] || []
}

export function getSampleServicesBySubcategory(subcategoryId: string) {
  return SAMPLE_SERVICES_BY_SUBCATEGORY[subcategoryId] || []
}
