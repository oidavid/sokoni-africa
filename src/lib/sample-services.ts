/**
 * Earket Regional Sample Services
 * All service subcategories with real market pricing per region.
 * Services are presented with executive-level descriptions.
 *
 * Usage: getSampleServices(subcategory, countryCode)
 *        getRegionalServices(category, countryCode)
 */

type SampleService = {
  name: string
  description: string
  price: number
  price_display: string
  in_stock: boolean
  image_url: string
}

const PH = 'https://watdsaazzjcsyvnpdthe.supabase.co/storage/v1/object/public/placeholders'

// ─── COUNTRY → REGION MAPPING ─────────────────────────────────────────────
const COUNTRY_REGION: Record<string, string> = {
  NG: 'west_africa', GH: 'west_africa', CI: 'west_africa', SN: 'west_africa',
  GM: 'west_africa', GN: 'west_africa', SL: 'west_africa', LR: 'west_africa',
  TG: 'west_africa', BJ: 'west_africa', BF: 'west_africa', ML: 'west_africa',
  NE: 'west_africa', CM: 'west_africa', CV: 'west_africa', GW: 'west_africa',
  KE: 'east_africa', TZ: 'east_africa', UG: 'east_africa', ET: 'east_africa',
  RW: 'east_africa', BI: 'east_africa', SS: 'east_africa', SO: 'east_africa',
  ER: 'east_africa', MG: 'east_africa', MU: 'east_africa',
  ZA: 'southern_africa', ZW: 'southern_africa', ZM: 'southern_africa',
  MZ: 'southern_africa', BW: 'southern_africa', NA: 'southern_africa',
  LS: 'southern_africa', SZ: 'southern_africa', AO: 'southern_africa',
  EG: 'north_africa', MA: 'north_africa', TN: 'north_africa', DZ: 'north_africa',
  LY: 'north_africa', SD: 'north_africa',
  JM: 'caribbean', TT: 'caribbean', HT: 'caribbean', BB: 'caribbean',
  GY: 'caribbean', SR: 'caribbean', BS: 'caribbean', LC: 'caribbean',
  VC: 'caribbean', GD: 'caribbean', AG: 'caribbean', DM: 'caribbean',
  MX: 'latin_america', BR: 'latin_america', CO: 'latin_america', PE: 'latin_america',
  AR: 'latin_america', CL: 'latin_america', EC: 'latin_america', BO: 'latin_america',
  PY: 'latin_america', UY: 'latin_america', VE: 'latin_america', CR: 'latin_america',
  PA: 'latin_america', GT: 'latin_america', HN: 'latin_america', NI: 'latin_america',
  SV: 'latin_america', DO: 'latin_america', CU: 'latin_america',
  AE: 'middle_east', SA: 'middle_east', KW: 'middle_east', QA: 'middle_east',
  OM: 'middle_east', JO: 'middle_east', LB: 'middle_east', IQ: 'middle_east',
  YE: 'middle_east', BH: 'middle_east',
  IN: 'south_asia', PK: 'south_asia', BD: 'south_asia', LK: 'south_asia',
  NP: 'south_asia',
  ID: 'southeast_asia', PH: 'southeast_asia', VN: 'southeast_asia',
  MY: 'southeast_asia', TH: 'southeast_asia', MM: 'southeast_asia',
  KH: 'southeast_asia', SG: 'southeast_asia',
  GB: 'uk_europe', FR: 'uk_europe', DE: 'uk_europe', NL: 'uk_europe',
  BE: 'uk_europe', IT: 'uk_europe', ES: 'uk_europe', PT: 'uk_europe',
  IE: 'uk_europe', SE: 'uk_europe', NO: 'uk_europe', DK: 'uk_europe',
  FI: 'uk_europe', AT: 'uk_europe', CH: 'uk_europe', PL: 'uk_europe',
  US: 'north_america', CA: 'north_america', AU: 'north_america', NZ: 'north_america',
}

// ─── PRICING CONFIGS BY REGION ────────────────────────────────────────────
// Each region has a price multiplier relative to Nigeria (1x) and its symbol
const REGION_CONFIG: Record<string, { sym: string; fmt: (n: number) => string }> = {
  west_africa:    { sym: '₦', fmt: n => `₦${n.toLocaleString()}` },
  east_africa:    { sym: 'KSh', fmt: n => `KSh ${n.toLocaleString()}` },
  southern_africa:{ sym: 'R', fmt: n => `R${n}` },
  north_africa:   { sym: 'EGP', fmt: n => `EGP ${n}` },
  caribbean:      { sym: '$', fmt: n => `$${n}` },
  latin_america:  { sym: '$', fmt: n => `$${n}` },
  middle_east:    { sym: 'AED', fmt: n => `AED ${n}` },
  south_asia:     { sym: '₹', fmt: n => `₹${n}` },
  southeast_asia: { sym: 'Rp', fmt: n => `Rp ${n.toLocaleString()}` },
  uk_europe:      { sym: '£', fmt: n => `£${n}` },
  north_america:  { sym: '$', fmt: n => `$${n}` },
}

// ─── SERVICE CATALOGUE BUILDER ─────────────────────────────────────────────
// Each service defined once with prices per region
type ServiceDef = {
  name: string
  description: string
  image_url: string
  prices: Partial<Record<string, number>>
}

// ─── MASSAGE ──────────────────────────────────────────────────────────────
const MASSAGE_SERVICES: ServiceDef[] = [
  {
    name: 'Swedish Relaxation Massage (60 min)',
    description: 'Gentle full-body massage to release tension and restore calm. Warm oils, professional technique. The perfect reset for body and mind.',
    image_url: `${PH}/massage.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 450, north_africa: 400, caribbean: 65, latin_america: 35, middle_east: 180, south_asia: 1200, southeast_asia: 150000, uk_europe: 65, north_america: 90 },
  },
  {
    name: 'Deep Tissue Massage (60 min)',
    description: 'Firm therapeutic pressure targeting deep muscle layers and chronic tension. Ideal for back pain, stiff neck and overworked muscles.',
    image_url: `${PH}/deep-tissue.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 550, north_africa: 500, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1500, southeast_asia: 200000, uk_europe: 75, north_america: 110 },
  },
  {
    name: 'Hot Stone Massage (75 min)',
    description: 'Smooth heated basalt stones combined with expert massage technique. Deeply relaxing, warming and luxurious. A true premium experience.',
    image_url: `${PH}/deep-tissue.jpg`,
    prices: { west_africa: 25000, east_africa: 4500, southern_africa: 680, north_africa: 600, caribbean: 95, latin_america: 55, middle_east: 280, south_asia: 2000, southeast_asia: 250000, uk_europe: 95, north_america: 130 },
  },
  {
    name: 'Couples Massage (2 persons)',
    description: 'Side-by-side massage for two people. Perfect for date nights, anniversaries and special occasions. Champagne on request.',
    image_url: `${PH}/massage.jpg`,
    prices: { west_africa: 35000, east_africa: 6500, southern_africa: 950, north_africa: 900, caribbean: 140, latin_america: 80, middle_east: 420, south_asia: 3000, southeast_asia: 380000, uk_europe: 140, north_america: 180 },
  },
  {
    name: 'Sports & Recovery Massage',
    description: 'Targeted therapy for athletes and active individuals. Reduces soreness, improves flexibility and accelerates post-workout recovery.',
    image_url: `${PH}/sports-massage.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 550, north_africa: 480, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1500, southeast_asia: 200000, uk_europe: 75, north_america: 110 },
  },
  {
    name: 'Aromatherapy Massage (90 min)',
    description: 'Full body massage using therapeutic essential oils tailored to your needs. Deeply relaxing, balancing and restorative.',
    image_url: `${PH}/aromatherapy.jpg`,
    prices: { west_africa: 25000, east_africa: 4000, southern_africa: 620, north_africa: 550, caribbean: 90, latin_america: 50, middle_east: 260, south_asia: 1800, southeast_asia: 230000, uk_europe: 85, north_america: 120 },
  },
  {
    name: 'Reflexology (Foot Massage)',
    description: 'Specialised pressure applied to reflex points on the feet. Promotes healing, reduces stress and improves sleep quality.',
    image_url: `${PH}/massage.jpg`,
    prices: { west_africa: 10000, east_africa: 1800, southern_africa: 320, north_africa: 280, caribbean: 50, latin_america: 28, middle_east: 130, south_asia: 900, southeast_asia: 120000, uk_europe: 45, north_america: 65 },
  },
  {
    name: 'Prenatal Massage (60 min)',
    description: 'Safe and soothing massage for expectant mothers. Relieves back pain, swelling and pregnancy tension. Side-lying position with bolster support.',
    image_url: `${PH}/massage.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 520, north_africa: 460, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1500, southeast_asia: 200000, uk_europe: 75, north_america: 105 },
  },
  {
    name: 'Chair Massage (30 min)',
    description: 'Quick and effective seated massage targeting the neck, shoulders and upper back. Great for office visits and corporate wellness days.',
    image_url: `${PH}/massage.jpg`,
    prices: { west_africa: 7000, east_africa: 1200, southern_africa: 220, north_africa: 200, caribbean: 35, latin_america: 20, middle_east: 95, south_asia: 650, southeast_asia: 80000, uk_europe: 35, north_america: 50 },
  },
  {
    name: 'Back, Neck & Shoulder Massage (45 min)',
    description: 'Focused session on the most common tension areas. Relieves headaches, stiffness and upper body pain. Perfect for desk workers.',
    image_url: `${PH}/deep-tissue.jpg`,
    prices: { west_africa: 12000, east_africa: 2000, southern_africa: 350, north_africa: 320, caribbean: 55, latin_america: 30, middle_east: 150, south_asia: 1000, southeast_asia: 130000, uk_europe: 50, north_america: 70 },
  },
]

// ─── BRAIDING ─────────────────────────────────────────────────────────────
const BRAIDING_SERVICES: ServiceDef[] = [
  {
    name: 'Knotless Box Braids (Full Head)',
    description: 'Lightweight knotless braids with no tension on the scalp. Natural-looking roots, versatile styling. Lasts 6–8 weeks.',
    image_url: `${PH}/hair-braiding-service.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 450, north_africa: 400, caribbean: 150, latin_america: 80, middle_east: 300, south_asia: 2000, southeast_asia: 200000, uk_europe: 180, north_america: 220 },
  },
  {
    name: 'Cornrows (Classic & Feed-in)',
    description: 'Neat cornrows in various styles — straight back, side parts, zigzag and creative patterns. Protective and low-maintenance.',
    image_url: `${PH}/hair-braiding-service.jpg`,
    prices: { west_africa: 5000, east_africa: 900, southern_africa: 180, north_africa: 150, caribbean: 60, latin_america: 35, middle_east: 120, south_asia: 800, southeast_asia: 80000, uk_europe: 70, north_america: 90 },
  },
  {
    name: 'Senegalese Twists (Full Head)',
    description: 'Elegant rope twists using quality hair extensions. Sleek, sophisticated and protective. Lasts up to 8 weeks.',
    image_url: `${PH}/hair-braiding-service.jpg`,
    prices: { west_africa: 12000, east_africa: 2000, southern_africa: 380, north_africa: 340, caribbean: 130, latin_america: 70, middle_east: 250, south_asia: 1800, southeast_asia: 180000, uk_europe: 160, north_america: 190 },
  },
  {
    name: 'Passion Twists (Full Head)',
    description: 'Bohemian-style passion twists using wavy hair. Full, textured and beautiful. A stunning protective style.',
    image_url: `${PH}/hair-braiding-service.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 450, north_africa: 400, caribbean: 150, latin_america: 80, middle_east: 300, south_asia: 2000, southeast_asia: 200000, uk_europe: 180, north_america: 220 },
  },
  {
    name: 'Ghana Weave (Feed-in Braids)',
    description: 'Flat feed-in braids lying close to the scalp in elegant patterns. Neat, versatile and long-lasting.',
    image_url: `${PH}/hair-braiding-service.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 280, north_africa: 250, caribbean: 90, latin_america: 50, middle_east: 180, south_asia: 1200, southeast_asia: 120000, uk_europe: 110, north_america: 140 },
  },
  {
    name: 'Hair Braiding (Children)',
    description: "Gentle, patient braiding for children. Simple styles done with care to keep little ones comfortable.",
    image_url: `${PH}/hair-braiding-service.jpg`,
    prices: { west_africa: 3000, east_africa: 500, southern_africa: 120, north_africa: 100, caribbean: 45, latin_america: 25, middle_east: 90, south_asia: 600, southeast_asia: 60000, uk_europe: 55, north_america: 70 },
  },
]

// ─── MAKEUP ───────────────────────────────────────────────────────────────
const MAKEUP_SERVICES: ServiceDef[] = [
  {
    name: 'Bridal Makeup (Full Glam)',
    description: 'Complete bridal makeup for your wedding day. Trial session included. Camera-ready, long-lasting and flawlessly executed.',
    image_url: `${PH}/makeup-full.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1500, north_africa: 1200, caribbean: 350, latin_america: 200, middle_east: 800, south_asia: 6000, southeast_asia: 600000, uk_europe: 350, north_america: 450 },
  },
  {
    name: 'Event Makeup (Full Face)',
    description: 'Full glam for parties, birthdays and celebrations. Natural or dramatic looks. Professional products, lashes included.',
    image_url: `${PH}/makeup-full.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 120, latin_america: 65, middle_east: 250, south_asia: 1800, southeast_asia: 200000, uk_europe: 120, north_america: 150 },
  },
  {
    name: 'Natural / No-Makeup Look',
    description: 'Soft, enhanced and effortlessly glowing. Perfect for everyday, work and daytime occasions. Buildable coverage, flawless finish.',
    image_url: `${PH}/makeup-full.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 280, north_africa: 240, caribbean: 70, latin_america: 40, middle_east: 150, south_asia: 1000, southeast_asia: 120000, uk_europe: 75, north_america: 95 },
  },
  {
    name: 'Gele Tying (Head Tie Styling)',
    description: 'Expert gele tying for weddings, parties and ceremonies. Fan, turban and classic styles available. You will look stunning.',
    image_url: `${PH}/hair-braiding-service.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 180, north_africa: 150, caribbean: 50, latin_america: 30, middle_east: 110, south_asia: 700, southeast_asia: 80000, uk_europe: 60, north_america: 75 },
  },
  {
    name: 'Makeup Lesson (1-on-1)',
    description: 'Personal makeup tutorial tailored to your face, skin tone and lifestyle. Learn techniques that work for you every day.',
    image_url: `${PH}/makeup-full.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 100, latin_america: 60, middle_east: 250, south_asia: 1800, southeast_asia: 180000, uk_europe: 120, north_america: 150 },
  },
]

// ─── NAILS ────────────────────────────────────────────────────────────────
const NAILS_SERVICES: ServiceDef[] = [
  {
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish manicure. Chip-resistant, high-shine finish that stays perfect for 2–3 weeks. Your hands deserve this.',
    image_url: `${PH}/acrylic-nails.jpg`,
    prices: { west_africa: 6000, east_africa: 1000, southern_africa: 200, north_africa: 180, caribbean: 45, latin_america: 25, middle_east: 100, south_asia: 700, southeast_asia: 80000, uk_europe: 35, north_america: 45 },
  },
  {
    name: 'Acrylic Nails (Full Set)',
    description: 'Acrylic nail extensions in your preferred length and shape — coffin, almond, square or stiletto. Flawless every time.',
    image_url: `${PH}/acrylic-nails.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 65, latin_america: 38, middle_east: 150, south_asia: 1100, southeast_asia: 130000, uk_europe: 55, north_america: 70 },
  },
  {
    name: 'Nail Art Design',
    description: 'Creative nail art — ombre gradients, French tips, 3D gems, chrome and stamping designs. Instagram-worthy, guaranteed.',
    image_url: `${PH}/acrylic-nails.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 240, caribbean: 55, latin_america: 32, middle_east: 130, south_asia: 950, southeast_asia: 110000, uk_europe: 45, north_america: 60 },
  },
  {
    name: 'Pedicure & Foot Care',
    description: 'Complete pedicure with soak, scrub, callus removal, cuticle care and polish. Leave with soft, beautiful feet.',
    image_url: `${PH}/acrylic-nails.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 180, north_africa: 160, caribbean: 40, latin_america: 22, middle_east: 90, south_asia: 650, southeast_asia: 75000, uk_europe: 30, north_america: 40 },
  },
  {
    name: 'Nail Infill / Refill',
    description: 'Maintenance fill for grown-out acrylic or gel nails. Keeps your set looking fresh and polished. Recommended every 2–3 weeks.',
    image_url: `${PH}/acrylic-nails.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 180, north_africa: 160, caribbean: 40, latin_america: 22, middle_east: 90, south_asia: 650, southeast_asia: 75000, uk_europe: 30, north_america: 40 },
  },
  {
    name: 'Nail Removal & Prep',
    description: 'Safe, professional removal of old gel or acrylic. Nails soaked off gently with zero damage to the natural nail.',
    image_url: `${PH}/acrylic-nails.jpg`,
    prices: { west_africa: 3000, east_africa: 500, southern_africa: 110, north_africa: 100, caribbean: 25, latin_america: 15, middle_east: 60, south_asia: 400, southeast_asia: 45000, uk_europe: 20, north_america: 25 },
  },
]

// ─── BARBER ───────────────────────────────────────────────────────────────
const BARBER_SERVICES: ServiceDef[] = [
  {
    name: 'Haircut & Styling',
    description: 'Precision haircut and styling by a skilled barber. Fade, taper, afro shape and more. Clean lines, sharp finish every single time.',
    image_url: `${PH}/mens-haircut.jpg`,
    prices: { west_africa: 3000, east_africa: 500, southern_africa: 100, north_africa: 90, caribbean: 25, latin_america: 12, middle_east: 45, south_asia: 300, southeast_asia: 35000, uk_europe: 20, north_america: 28 },
  },
  {
    name: 'Beard Trim & Shape',
    description: 'Expert beard trimming, shaping and lining. Clean, defined and groomed to perfection.',
    image_url: `${PH}/mens-haircut.jpg`,
    prices: { west_africa: 1500, east_africa: 250, southern_africa: 50, north_africa: 45, caribbean: 15, latin_america: 8, middle_east: 30, south_asia: 180, southeast_asia: 20000, uk_europe: 12, north_america: 18 },
  },
  {
    name: 'Hot Towel Shave',
    description: 'Classic straight razor hot towel shave. Softens the beard for the closest, most comfortable and luxurious shave you will ever experience.',
    image_url: `${PH}/mens-haircut.jpg`,
    prices: { west_africa: 2000, east_africa: 350, southern_africa: 65, north_africa: 60, caribbean: 20, latin_america: 12, middle_east: 40, south_asia: 250, southeast_asia: 28000, uk_europe: 18, north_america: 25 },
  },
  {
    name: "Kids' Haircut",
    description: 'Gentle and patient haircuts for boys. We make it fun and comfortable. All styles done with care.',
    image_url: `${PH}/mens-haircut.jpg`,
    prices: { west_africa: 2000, east_africa: 350, southern_africa: 70, north_africa: 60, caribbean: 18, latin_america: 10, middle_east: 35, south_asia: 220, southeast_asia: 25000, uk_europe: 14, north_america: 20 },
  },
  {
    name: 'Full Groom Package',
    description: 'The complete experience — haircut, beard trim, hot towel and face wash in one session. Walk out looking your absolute best.',
    image_url: `${PH}/mens-haircut.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 160, north_africa: 140, caribbean: 45, latin_america: 25, middle_east: 90, south_asia: 600, southeast_asia: 70000, uk_europe: 40, north_america: 55 },
  },
]

// ─── SKINCARE ─────────────────────────────────────────────────────────────
const SKINCARE_SERVICES: ServiceDef[] = [
  {
    name: 'Deep Cleansing Facial',
    description: 'Thorough facial cleanse, steam, exfoliation and extractions. Removes impurities, unclogs pores and leaves skin visibly clear and glowing.',
    image_url: `${PH}/facial.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 70, latin_america: 40, middle_east: 160, south_asia: 1100, southeast_asia: 130000, uk_europe: 65, north_america: 85 },
  },
  {
    name: 'Brightening & Glow Facial',
    description: 'Vitamin C-based treatment targeting dark spots and dullness. Leaves the complexion visibly brighter, even and radiant.',
    image_url: `${PH}/facial.jpg`,
    prices: { west_africa: 12000, east_africa: 2000, southern_africa: 380, north_africa: 340, caribbean: 85, latin_america: 48, middle_east: 190, south_asia: 1300, southeast_asia: 160000, uk_europe: 75, north_america: 100 },
  },
  {
    name: 'Acne Treatment Facial',
    description: 'Targeted treatment for acne-prone and breakout skin. Anti-bacterial cleanse, clay mask and soothing spot treatment.',
    image_url: `${PH}/facial.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 460, north_africa: 400, caribbean: 95, latin_america: 55, middle_east: 220, south_asia: 1600, southeast_asia: 190000, uk_europe: 90, north_america: 115 },
  },
  {
    name: 'Anti-Ageing Facial',
    description: 'Premium anti-ageing treatment to firm, smooth and rejuvenate mature skin. Reduces fine lines and restores youthful radiance.',
    image_url: `${PH}/facial.jpg`,
    prices: { west_africa: 18000, east_africa: 3000, southern_africa: 550, north_africa: 480, caribbean: 110, latin_america: 65, middle_east: 260, south_asia: 1900, southeast_asia: 220000, uk_europe: 110, north_america: 140 },
  },
  {
    name: 'Body Scrub & Exfoliation',
    description: 'Full body exfoliation using sugar or salt scrub. Removes dead skin cells, smooths texture and leaves skin silky soft all over.',
    image_url: `${PH}/facial.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 230, caribbean: 60, latin_america: 35, middle_east: 140, south_asia: 950, southeast_asia: 110000, uk_europe: 55, north_america: 75 },
  },
  {
    name: 'Skin Consultation',
    description: 'One-on-one skin assessment with a qualified skincare specialist. Walk away with a personalised routine and clear action plan.',
    image_url: `${PH}/facial.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 170, north_africa: 150, caribbean: 40, latin_america: 22, middle_east: 95, south_asia: 650, southeast_asia: 75000, uk_europe: 40, north_america: 55 },
  },
]

// ─── WIGS ─────────────────────────────────────────────────────────────────
const WIGS_SERVICES: ServiceDef[] = [
  {
    name: 'Custom Wig Making (Human Hair)',
    description: 'Full custom wig crafted with premium human hair. Your choice of length, texture and density. Designed to look completely natural.',
    image_url: `${PH}/wig-install.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1600, north_africa: 1400, caribbean: 300, latin_america: 180, middle_east: 700, south_asia: 5000, southeast_asia: 550000, uk_europe: 320, north_america: 400 },
  },
  {
    name: 'Frontal Wig Installation',
    description: 'Lace frontal wig install — glued, sewn or glueless method. Seamless hairline blend. Undetectable and stunning.',
    image_url: `${PH}/wig-install.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 100, latin_america: 60, middle_east: 250, south_asia: 1800, southeast_asia: 200000, uk_europe: 120, north_america: 150 },
  },
  {
    name: 'Wig Customisation & Styling',
    description: 'Transform a store-bought wig into a custom masterpiece. Bleach knots, pluck hairline, cut and style to your preference.',
    image_url: `${PH}/wig-install.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 70, latin_america: 40, middle_east: 170, south_asia: 1200, southeast_asia: 140000, uk_europe: 80, north_america: 100 },
  },
  {
    name: 'Wig Repair & Revamp',
    description: 'Restore a tangled or damaged wig to its former glory. Deep condition, detangle, restitch and restyle.',
    image_url: `${PH}/wig-install.jpg`,
    prices: { west_africa: 7000, east_africa: 1200, southern_africa: 230, north_africa: 200, caribbean: 55, latin_america: 30, middle_east: 130, south_asia: 900, southeast_asia: 100000, uk_europe: 60, north_america: 75 },
  },
]

// ─── LIFE COACHING ────────────────────────────────────────────────────────
const COACHING_SERVICES: ServiceDef[] = [
  {
    name: 'Life Coaching Discovery Session (60 min)',
    description: 'Your first step. A focused session to explore where you are, where you want to go and what is truly holding you back. Clarity guaranteed.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 400, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1500, southeast_asia: 180000, uk_europe: 85, north_america: 120 },
  },
  {
    name: '90-Day Life Transformation Programme',
    description: 'A complete coaching journey — bi-weekly sessions, personalised action plans and powerful accountability. Real, measurable change in 90 days.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 150000, east_africa: 25000, southern_africa: 4800, north_africa: 4200, caribbean: 850, latin_america: 480, middle_east: 2200, south_asia: 15000, southeast_asia: 1800000, uk_europe: 900, north_america: 1200 },
  },
  {
    name: 'Values & Purpose Clarity Session',
    description: 'Deep coaching to uncover your core values, discover your purpose and align every life decision with what truly matters to you.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 110, north_america: 150 },
  },
  {
    name: 'Work-Life Balance Coaching',
    description: 'For driven professionals feeling stretched thin. Create clear boundaries, reclaim your time and build a life you genuinely love.',
    image_url: `${PH}/coaching-man.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 110, north_america: 150 },
  },
  {
    name: 'Monthly Accountability Coaching',
    description: 'Monthly goal-setting sessions with progress reviews, challenge-solving and the ongoing support to keep you moving forward consistently.',
    image_url: `${PH}/coaching-session.jpg`,
    prices: { west_africa: 30000, east_africa: 5000, southern_africa: 950, north_africa: 820, caribbean: 160, latin_america: 90, middle_east: 420, south_asia: 3000, southeast_asia: 350000, uk_europe: 160, north_america: 220 },
  },
  {
    name: 'Mindset & Confidence Coaching',
    description: 'Therapeutic coaching to rebuild your self-belief, eliminate limiting beliefs and step into the confident version of yourself.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 110, north_america: 150 },
  },
]

// ─── WOMEN'S EMPOWERMENT ──────────────────────────────────────────────────
const WOMENS_EMPOWERMENT_SERVICES: ServiceDef[] = [
  {
    name: "Women's Empowerment 1-on-1 Session",
    description: 'A powerful, confidential session for women ready to rise. Overcome barriers, own your story and step fully into your power.',
    image_url: `${PH}/womens-empowerment.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 110, north_america: 150 },
  },
  {
    name: 'Women in Business Coaching',
    description: 'Strategic coaching for women entrepreneurs. Build confidence, close deals, attract clients and grow a business that reflects your worth.',
    image_url: `${PH}/womens-empowerment.jpg`,
    prices: { west_africa: 25000, east_africa: 4200, southern_africa: 800, north_africa: 700, caribbean: 140, latin_america: 78, middle_east: 360, south_asia: 2500, southeast_asia: 290000, uk_europe: 140, north_america: 185 },
  },
  {
    name: "Women's Leadership Group Programme",
    description: 'Monthly group coaching for ambitious women. Community, accountability and powerful content to accelerate your leadership journey.',
    image_url: `${PH}/womens-empowerment.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 85, latin_america: 48, middle_east: 220, south_asia: 1500, southeast_asia: 180000, uk_europe: 90, north_america: 120 },
  },
  {
    name: 'Relationship & Boundaries Coaching',
    description: 'Coaching to help you build healthier relationships, set firm boundaries and communicate your needs with clarity and confidence.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 110, north_america: 150 },
  },
]

// ─── BUSINESS COACHING ────────────────────────────────────────────────────
const BUSINESS_COACHING_SERVICES: ServiceDef[] = [
  {
    name: 'Business Strategy Session (90 min)',
    description: 'Deep-dive strategy session for business owners and entrepreneurs. Walk away with a clear roadmap, prioritised actions and renewed focus.',
    image_url: `${PH}/coaching-man.jpg`,
    prices: { west_africa: 25000, east_africa: 4200, southern_africa: 800, north_africa: 700, caribbean: 140, latin_america: 80, middle_east: 360, south_asia: 2500, southeast_asia: 290000, uk_europe: 150, north_america: 200 },
  },
  {
    name: 'Brand & Positioning Workshop',
    description: 'Define your brand voice, ideal client and positioning. Leave with a clear identity that attracts the right customers consistently.',
    image_url: `${PH}/brand-workshop.jpg`,
    prices: { west_africa: 30000, east_africa: 5000, southern_africa: 950, north_africa: 840, caribbean: 170, latin_america: 95, middle_east: 430, south_asia: 3000, southeast_asia: 350000, uk_europe: 175, north_america: 240 },
  },
  {
    name: 'Pricing & Revenue Strategy Session',
    description: 'Stop undercharging. Learn how to price your offers confidently, package your services and build a sustainable revenue model.',
    image_url: `${PH}/revenue-strategy.jpg`,
    prices: { west_africa: 25000, east_africa: 4200, southern_africa: 800, north_africa: 700, caribbean: 140, latin_america: 78, middle_east: 360, south_asia: 2500, southeast_asia: 290000, uk_europe: 150, north_america: 200 },
  },
  {
    name: 'Small Business Growth Coaching (Monthly)',
    description: 'Monthly coaching for growing businesses. Sales, operations, team and mindset — everything you need to scale with confidence.',
    image_url: `${PH}/coaching-man.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1600, north_africa: 1400, caribbean: 280, latin_america: 160, middle_east: 720, south_asia: 5000, southeast_asia: 580000, uk_europe: 300, north_america: 400 },
  },
]

// ─── PUBLIC SPEAKING / EDUCATION ──────────────────────────────────────────
const EDUCATION_SERVICES: ServiceDef[] = [
  {
    name: 'Public Speaking & Presentation Training',
    description: 'Overcome fear, find your voice and communicate with genuine impact. Practical, confidence-building techniques for life and business.',
    image_url: `${PH}/public-speaking.jpg`,
    prices: { west_africa: 25000, east_africa: 4200, southern_africa: 800, north_africa: 700, caribbean: 140, latin_america: 78, middle_east: 360, south_asia: 2500, southeast_asia: 290000, uk_europe: 150, north_america: 200 },
  },
  {
    name: 'Primary School Home Tutoring',
    description: 'Patient, qualified tutoring for primary school children. All subjects, at the student\'s pace. Real improvement, real confidence.',
    image_url: `${PH}/tutoring.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 180, north_africa: 150, caribbean: 35, latin_america: 20, middle_east: 90, south_asia: 600, southeast_asia: 70000, uk_europe: 35, north_america: 50 },
  },
  {
    name: 'WAEC & JAMB Exam Preparation',
    description: 'Intensive exam coaching to maximise results in WAEC and JAMB. Past questions, strategies and mock tests. Pass with confidence.',
    image_url: `${PH}/exam-prep.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 230, caribbean: 50, latin_america: 28, middle_east: 140, south_asia: 950, southeast_asia: 110000, uk_europe: 55, north_america: 70 },
  },
  {
    name: 'SAT / ACT Prep (University Entrance)',
    description: 'Strategic coaching for SAT and ACT exams. Proven techniques, practice tests and targeted improvement in every section.',
    image_url: `${PH}/exam-prep.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1500, southeast_asia: 180000, uk_europe: 80, north_america: 110 },
  },
  {
    name: 'English Language & Communication (Adults)',
    description: 'Conversational English, business communication and professional writing coaching. Build fluency and confidence in English.',
    image_url: `${PH}/english.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 180, north_africa: 150, caribbean: 35, latin_america: 20, middle_east: 100, south_asia: 650, southeast_asia: 75000, uk_europe: 40, north_america: 55 },
  },
  {
    name: 'Coding for Beginners (8-week course)',
    description: 'Introduction to programming from absolute zero. Learn web basics, logic and build your first real project. Online or in-person.',
    image_url: `${PH}/coding.jpg`,
    prices: { west_africa: 30000, east_africa: 5000, southern_africa: 950, north_africa: 840, caribbean: 160, latin_america: 90, middle_east: 430, south_asia: 3000, southeast_asia: 350000, uk_europe: 180, north_america: 250 },
  },
  {
    name: 'Piano & Music Lessons (Monthly)',
    description: 'Piano, keyboard and music theory lessons for all ages and levels. Patient, qualified teacher. Monthly package of 4 sessions.',
    image_url: `${PH}/music.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 120, north_america: 160 },
  },
]

// ─── MENTAL WELLNESS ──────────────────────────────────────────────────────
const MENTAL_WELLNESS_SERVICES: ServiceDef[] = [
  {
    name: '1-on-1 Counselling Session (50 min)',
    description: 'A safe, confidential space to talk, process and begin healing. Trained counsellor, non-judgemental and deeply supportive.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 80, north_america: 120 },
  },
  {
    name: 'Stress & Burnout Recovery Programme',
    description: 'Structured support for chronic stress and emotional exhaustion. Practical tools to restore your energy, clarity and sense of self.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 110, latin_america: 60, middle_east: 290, south_asia: 2000, southeast_asia: 230000, uk_europe: 90, north_america: 130 },
  },
  {
    name: 'Mindfulness & Meditation Session',
    description: 'Guided mindfulness practice to calm the mind, reduce anxiety and cultivate present-moment awareness. Beginners welcome.',
    image_url: `${PH}/aromatherapy.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1500, southeast_asia: 180000, uk_europe: 60, north_america: 90 },
  },
  {
    name: 'Anxiety Coaching Programme (4 sessions)',
    description: 'Evidence-based coaching to understand, manage and reduce anxiety. Learn practical tools to rebuild calm and take back control.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 25000, east_africa: 4200, southern_africa: 800, north_africa: 700, caribbean: 140, latin_america: 78, middle_east: 360, south_asia: 2500, southeast_asia: 290000, uk_europe: 120, north_america: 180 },
  },
  {
    name: 'Grief & Loss Support Session',
    description: 'Compassionate, professional support through grief or major life loss. A gentle space to process and begin the journey toward healing.',
    image_url: `${PH}/coaching-woman.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 85, latin_america: 48, middle_east: 220, south_asia: 1500, southeast_asia: 180000, uk_europe: 70, north_america: 110 },
  },
]

// ─── CHILDCARE ────────────────────────────────────────────────────────────
const CHILDCARE_SERVICES: ServiceDef[] = [
  {
    name: 'Full-time Nanny Service (Daily)',
    description: 'Experienced, trustworthy nanny for complete daily childcare. Background checked, warm, reliable and excellent with children of all ages.',
    image_url: `${PH}/childcare.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 100, latin_america: 55, middle_east: 280, south_asia: 1800, southeast_asia: 200000, uk_europe: 100, north_america: 150 },
  },
  {
    name: 'After-school Care & Pickup',
    description: 'Safe after-school pickup, supervision and homework support until parents return. Snacks, activities and a nurturing environment.',
    image_url: `${PH}/childcare.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 230, caribbean: 55, latin_america: 30, middle_east: 150, south_asia: 1000, southeast_asia: 120000, uk_europe: 55, north_america: 80 },
  },
  {
    name: 'Babysitting (Evening or Weekend)',
    description: 'Reliable babysitting for evenings and weekends. Caring, fun and experienced. All ages welcome. References available.',
    image_url: `${PH}/childcare.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 170, north_africa: 150, caribbean: 40, latin_america: 22, middle_east: 100, south_asia: 700, southeast_asia: 80000, uk_europe: 15, north_america: 20 },
  },
  {
    name: 'Special Needs Childcare',
    description: 'Specialised, patient care for children with additional needs. Trained, compassionate and committed to each child\'s wellbeing.',
    image_url: `${PH}/childcare.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 130, latin_america: 72, middle_east: 350, south_asia: 2500, southeast_asia: 280000, uk_europe: 140, north_america: 200 },
  },
  {
    name: 'Homework Help & Study Support',
    description: 'Patient one-on-one homework assistance for primary and secondary school children. All subjects, clear explanations, real results.',
    image_url: `${PH}/tutoring.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 170, north_africa: 150, caribbean: 35, latin_america: 20, middle_east: 95, south_asia: 650, southeast_asia: 75000, uk_europe: 30, north_america: 45 },
  },
]

// ─── FOOD & CATERING ──────────────────────────────────────────────────────
const FOOD_CATERING_SERVICES: ServiceDef[] = [
  {
    name: 'Weekly Meal Prep Service',
    description: 'Freshly cooked meals planned, prepared and portioned for the entire week. You choose the menu — just reheat and enjoy. Life made simpler.',
    image_url: `${PH}/private-chef.jpg`,
    prices: { west_africa: 25000, east_africa: 4200, southern_africa: 800, north_africa: 700, caribbean: 160, latin_america: 90, middle_east: 420, south_asia: 3000, southeast_asia: 350000, uk_europe: 180, north_america: 250 },
  },
  {
    name: 'Home-cooked Meal Delivery',
    description: 'Freshly cooked local and continental meals delivered to your door. Order daily or weekly. Real food, real flavour.',
    image_url: `${PH}/meal-delivery.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 170, north_africa: 150, caribbean: 35, latin_america: 18, middle_east: 100, south_asia: 700, southeast_asia: 80000, uk_europe: 18, north_america: 25 },
  },
  {
    name: 'Party & Event Catering (per head)',
    description: 'Professional event catering for birthdays, weddings and celebrations. Full buffet, menu planning, cooking, serving and cleanup included.',
    image_url: `${PH}/meal-delivery.jpg`,
    prices: { west_africa: 3000, east_africa: 500, southern_africa: 100, north_africa: 90, caribbean: 22, latin_america: 12, middle_east: 65, south_asia: 450, southeast_asia: 50000, uk_europe: 25, north_america: 35 },
  },
  {
    name: 'Private Chef for Dinner',
    description: 'An experienced chef comes to your home and creates a restaurant-quality dinner. For date nights, family occasions and private entertaining.',
    image_url: `${PH}/private-chef.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1600, north_africa: 1400, caribbean: 280, latin_america: 160, middle_east: 750, south_asia: 5500, southeast_asia: 600000, uk_europe: 300, north_america: 400 },
  },
  {
    name: 'Custom Cakes & Pastries',
    description: 'Beautifully crafted custom celebration cakes for birthdays, weddings and events. Fondant and buttercream, designed to your exact vision.',
    image_url: `${PH}/custom-cake.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1500, southeast_asia: 180000, uk_europe: 100, north_america: 130 },
  },
  {
    name: 'Diet & Healthy Meal Plan (Weekly)',
    description: 'Nutritionist-guided clean eating programme. Balanced, delicious meals for weight loss, muscle gain or general wellbeing.',
    image_url: `${PH}/healthy-meal.jpg`,
    prices: { west_africa: 30000, east_africa: 5000, southern_africa: 950, north_africa: 840, caribbean: 180, latin_america: 100, middle_east: 480, south_asia: 3500, southeast_asia: 400000, uk_europe: 200, north_america: 280 },
  },
]

// ─── HEALTH & WELLNESS ────────────────────────────────────────────────────
const HEALTH_WELLNESS_SERVICES: ServiceDef[] = [
  {
    name: 'Home Physiotherapy Visit',
    description: 'Professional physiotherapy at your home for pain relief, injury recovery and rehabilitation. Licensed therapist, personalised treatment plan.',
    image_url: `${PH}/health-products.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 90, latin_america: 50, middle_east: 250, south_asia: 1800, southeast_asia: 200000, uk_europe: 80, north_america: 120 },
  },
  {
    name: 'Personal Fitness Training (Per Session)',
    description: 'One-on-one fitness coaching at home or gym. Tailored programme for weight loss, muscle building or general fitness. No fluff, real results.',
    image_url: `${PH}/fitness.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 60, latin_america: 35, middle_east: 170, south_asia: 1200, southeast_asia: 140000, uk_europe: 55, north_america: 80 },
  },
  {
    name: 'Nutrition & Diet Consultation',
    description: 'Professional nutritional assessment with a personalised meal plan. Evidence-based advice for sustainable weight management and wellness.',
    image_url: `${PH}/healthy-meal.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 230, caribbean: 55, latin_america: 30, middle_east: 150, south_asia: 1000, southeast_asia: 120000, uk_europe: 60, north_america: 85 },
  },
  {
    name: 'Elderly Home Care (Daily)',
    description: 'Compassionate, dignified care for elderly family members. Daily assistance, medication reminders, companionship and safety monitoring.',
    image_url: `${PH}/elderly-care.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 120, latin_america: 65, middle_east: 350, south_asia: 2500, southeast_asia: 280000, uk_europe: 130, north_america: 180 },
  },
  {
    name: 'Mobile Nursing Services',
    description: 'Professional nursing at home — wound care, injections, drips and post-surgery support. Registered nurse, prompt and fully equipped.',
    image_url: `${PH}/health-products.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 65, latin_america: 38, middle_east: 180, south_asia: 1300, southeast_asia: 150000, uk_europe: 70, north_america: 100 },
  },
]

// ─── DOMESTIC SERVICES ────────────────────────────────────────────────────
const DOMESTIC_SERVICES: ServiceDef[] = [
  {
    name: 'Home Deep Cleaning',
    description: 'Comprehensive deep cleaning of your entire home. We bring all professional equipment and supplies. Leave it to us completely.',
    image_url: `${PH}/deep-cleaning.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 90, latin_america: 50, middle_east: 250, south_asia: 1800, southeast_asia: 200000, uk_europe: 120, north_america: 180 },
  },
  {
    name: 'Weekly House Cleaning',
    description: 'Regular weekly cleaning to keep your home consistently spotless. Same reliable cleaner every visit. Flexible scheduling.',
    image_url: `${PH}/house-cleaning.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 230, caribbean: 55, latin_america: 30, middle_east: 150, south_asia: 1000, southeast_asia: 120000, uk_europe: 75, north_america: 110 },
  },
  {
    name: 'Laundry & Ironing Service',
    description: 'Wash, dry and perfectly iron your clothes. Pick-up and delivery available. 24-hour turnaround. Fresh, crisp and ready to wear.',
    image_url: `${PH}/house-cleaning.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 170, north_africa: 150, caribbean: 35, latin_america: 18, middle_east: 95, south_asia: 650, southeast_asia: 75000, uk_europe: 25, north_america: 35 },
  },
  {
    name: 'Home Cooking Service',
    description: 'A skilled cook comes to your home and prepares fresh meals in your kitchen. Soups, stews and full local meals. Tailored to your preferences.',
    image_url: `${PH}/home-cooking.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 60, latin_america: 35, middle_east: 170, south_asia: 1200, southeast_asia: 140000, uk_europe: 80, north_america: 110 },
  },
  {
    name: 'Pest Control Treatment',
    description: 'Professional treatment for cockroaches, rats, termites, ants and mosquitoes. Safe, effective products. Certificate provided.',
    image_url: `${PH}/electrical.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 90, latin_america: 50, middle_east: 250, south_asia: 1800, southeast_asia: 200000, uk_europe: 120, north_america: 175 },
  },
]

// ─── DIGITAL SERVICES ─────────────────────────────────────────────────────
const DIGITAL_SERVICES: ServiceDef[] = [
  {
    name: 'Logo Design',
    description: 'Professional logo design that captures your brand essence. 3 distinct concepts, unlimited revisions. PNG, JPG and vector formats delivered.',
    image_url: `${PH}/logo-design.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 120, latin_america: 65, middle_east: 320, south_asia: 2500, southeast_asia: 280000, uk_europe: 200, north_america: 300 },
  },
  {
    name: 'Phone Screen Repair',
    description: 'Professional screen replacement for iPhone, Samsung, Tecno and Infinix. Same-day repair. Genuine parts. Warranty included.',
    image_url: `${PH}/phone-repair.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 65, latin_america: 38, middle_east: 180, south_asia: 1300, southeast_asia: 150000, uk_europe: 80, north_america: 120 },
  },
  {
    name: 'Laptop Repair & Maintenance',
    description: 'Expert repairs for screen, battery, keyboard and software issues. All major brands. Free diagnosis. Fast, reliable turnaround.',
    image_url: `${PH}/laptop-repair.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 560, caribbean: 120, latin_america: 70, middle_east: 330, south_asia: 2400, southeast_asia: 280000, uk_europe: 120, north_america: 180 },
  },
  {
    name: 'Social Media Management (Monthly)',
    description: 'Complete monthly management of your Instagram and Facebook. Content creation, scheduling, engagement and growth strategy included.',
    image_url: `${PH}/social-media.jpg`,
    prices: { west_africa: 30000, east_africa: 5000, southern_africa: 950, north_africa: 840, caribbean: 200, latin_america: 110, middle_east: 540, south_asia: 4000, southeast_asia: 460000, uk_europe: 400, north_america: 550 },
  },
  {
    name: 'CV & Cover Letter Writing',
    description: 'Professional, ATS-optimised CV design and compelling cover letter. Stand out from the competition. Word and PDF delivered in 24 hours.',
    image_url: `${PH}/cv-writing.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 170, north_africa: 150, caribbean: 45, latin_america: 25, middle_east: 130, south_asia: 900, southeast_asia: 100000, uk_europe: 80, north_america: 120 },
  },
  {
    name: 'Flyer & Banner Design',
    description: 'Eye-catching, professional designs for events, promotions and businesses. Print and digital formats. Fast turnaround, unlimited revisions.',
    image_url: `${PH}/flyer-design.jpg`,
    prices: { west_africa: 5000, east_africa: 850, southern_africa: 170, north_africa: 150, caribbean: 40, latin_america: 22, middle_east: 110, south_asia: 800, southeast_asia: 90000, uk_europe: 70, north_america: 100 },
  },
]

// ─── TRANSPORT ────────────────────────────────────────────────────────────
const TRANSPORT_SERVICES: ServiceDef[] = [
  {
    name: 'Package Delivery — Same Day',
    description: 'Reliable same-day delivery of documents and parcels within the city. Fast, trackable and handled with care.',
    image_url: `${PH}/package-delivery.jpg`,
    prices: { west_africa: 3000, east_africa: 500, southern_africa: 100, north_africa: 90, caribbean: 20, latin_america: 10, middle_east: 55, south_asia: 400, southeast_asia: 45000, uk_europe: 15, north_america: 20 },
  },
  {
    name: 'Driver for Hire (Full Day)',
    description: 'Professional, courteous driver for personal or corporate use. Full-day hire. Your car or ours. Punctual and discreet.',
    image_url: `${PH}/driver-hire.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 100, latin_america: 55, middle_east: 280, south_asia: 2000, southeast_asia: 230000, uk_europe: 180, north_america: 250 },
  },
  {
    name: 'Airport Pick-up & Drop-off',
    description: 'Reliable airport transfers with flight tracking and meet and greet. Punctual, comfortable and stress-free. Book 24 hours in advance.',
    image_url: `${PH}/airport-pickup.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 55, latin_america: 30, middle_east: 180, south_asia: 1300, southeast_asia: 150000, uk_europe: 60, north_america: 85 },
  },
  {
    name: 'School Run Service (Daily)',
    description: 'Dependable daily school run for children. Morning pickup, safe drop-off, afternoon collection. Trusted, vetted and punctual.',
    image_url: `${PH}/bike-courier.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 230, caribbean: 50, latin_america: 28, middle_east: 150, south_asia: 1000, southeast_asia: 120000, uk_europe: 80, north_america: 110 },
  },
  {
    name: 'Moving & Relocation Service',
    description: 'Professional house and office moving. Careful packing, loading and delivery. Fragile items handled with expert care.',
    image_url: `${PH}/driver-hire.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1600, north_africa: 1400, caribbean: 300, latin_america: 170, middle_east: 800, south_asia: 6000, southeast_asia: 680000, uk_europe: 400, north_america: 550 },
  },
]

// ─── HOME SERVICES ────────────────────────────────────────────────────────
const HOME_SERVICES: ServiceDef[] = [
  {
    name: 'House Wiring & Electrical Installation',
    description: 'Professional electrical wiring, installation and repairs by a certified electrician. Safe, code-compliant and fully guaranteed.',
    image_url: `${PH}/electrical.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 100, latin_america: 55, middle_east: 280, south_asia: 2000, southeast_asia: 230000, uk_europe: 120, north_america: 180 },
  },
  {
    name: 'Solar Panel Installation',
    description: 'Professional solar panel installation for homes and offices. Quality panels, certified installer. Full system with inverter and batteries.',
    image_url: `${PH}/solar-install.jpg`,
    prices: { west_africa: 150000, east_africa: 25000, southern_africa: 4800, north_africa: 4200, caribbean: 900, latin_america: 500, middle_east: 2400, south_asia: 18000, southeast_asia: 2000000, uk_europe: 1500, north_america: 2200 },
  },
  {
    name: 'Plumbing Repairs',
    description: 'Expert plumbing repair and installation. Burst pipes, leaking taps, blocked drains and bathroom fitting. Fast response, quality work.',
    image_url: `${PH}/electrical.jpg`,
    prices: { west_africa: 8000, east_africa: 1400, southern_africa: 260, north_africa: 230, caribbean: 65, latin_america: 36, middle_east: 180, south_asia: 1300, southeast_asia: 150000, uk_europe: 80, north_america: 120 },
  },
  {
    name: 'Air Conditioning Service & Repair',
    description: 'AC installation, servicing and repair for all major brands. Gas refill, cleaning and troubleshooting. Keeps you cool all year.',
    image_url: `${PH}/electrical.jpg`,
    prices: { west_africa: 10000, east_africa: 1700, southern_africa: 320, north_africa: 280, caribbean: 80, latin_america: 45, middle_east: 220, south_asia: 1600, southeast_asia: 180000, uk_europe: 100, north_america: 150 },
  },
  {
    name: 'Painting & Decorating',
    description: 'Professional interior and exterior painting. Clean finish, quality paints. Rooms, full houses and commercial spaces.',
    image_url: `${PH}/house-cleaning.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 120, latin_america: 65, middle_east: 340, south_asia: 2500, southeast_asia: 280000, uk_europe: 200, north_america: 280 },
  },
]

// ─── EVENTS ───────────────────────────────────────────────────────────────
const EVENTS_SERVICES: ServiceDef[] = [
  {
    name: 'Event Photography (Full Day)',
    description: 'Professional photography for weddings, birthdays and corporate events. Beautifully edited photos delivered within 48 hours.',
    image_url: `${PH}/coaching-session.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1600, north_africa: 1400, caribbean: 350, latin_america: 200, middle_east: 900, south_asia: 7000, southeast_asia: 800000, uk_europe: 600, north_america: 900 },
  },
  {
    name: 'Event Videography (Full Day)',
    description: 'Cinematic full event video coverage with professional editing. Highlight reel and full footage delivered. Drone shots available.',
    image_url: `${PH}/coaching-session.jpg`,
    prices: { west_africa: 70000, east_africa: 12000, southern_africa: 2200, north_africa: 2000, caribbean: 480, latin_america: 275, middle_east: 1250, south_asia: 9500, southeast_asia: 1100000, uk_europe: 800, north_america: 1200 },
  },
  {
    name: 'Event Decoration',
    description: 'Full event decoration service — draping, floral arrangements, centrepieces, lighting and backdrop. Transform any space beautifully.',
    image_url: `${PH}/coaching-session.jpg`,
    prices: { west_africa: 100000, east_africa: 17000, southern_africa: 3200, north_africa: 2800, caribbean: 650, latin_america: 380, middle_east: 1800, south_asia: 13000, southeast_asia: 1500000, uk_europe: 1000, north_america: 1500 },
  },
  {
    name: 'DJ Services (4 hours)',
    description: 'Professional DJ for parties, weddings and corporate events. Quality sound and lighting system included. Makes every event unforgettable.',
    image_url: `${PH}/music.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1600, north_africa: 1400, caribbean: 350, latin_america: 200, middle_east: 900, south_asia: 7000, southeast_asia: 800000, uk_europe: 500, north_america: 750 },
  },
  {
    name: 'MC & Event Hosting',
    description: 'Charismatic, professional MC for weddings, birthdays and corporate events. Keeps the programme on track and the crowd energised all night.',
    image_url: `${PH}/public-speaking.jpg`,
    prices: { west_africa: 30000, east_africa: 5000, southern_africa: 950, north_africa: 840, caribbean: 200, latin_america: 115, middle_east: 550, south_asia: 4200, southeast_asia: 480000, uk_europe: 400, north_america: 600 },
  },
  {
    name: 'Custom Cake (2-tier)',
    description: 'Beautifully crafted 2-tier custom celebration cake. Fondant or buttercream. Birthday, wedding and corporate designs tailored to your vision.',
    image_url: `${PH}/custom-cake.jpg`,
    prices: { west_africa: 25000, east_africa: 4200, southern_africa: 800, north_africa: 700, caribbean: 150, latin_america: 85, middle_east: 400, south_asia: 3000, southeast_asia: 350000, uk_europe: 200, north_america: 280 },
  },
]

// ─── AGRICULTURE ──────────────────────────────────────────────────────────
const AGRICULTURE_SERVICES: ServiceDef[] = [
  {
    name: 'Poultry Farm Consultation',
    description: 'Expert guidance on broiler and layer farming. Farm setup, feed management, disease prevention and profitability planning.',
    image_url: `${PH}/basmati-rice.jpg`,
    prices: { west_africa: 20000, east_africa: 3500, southern_africa: 650, north_africa: 550, caribbean: 100, latin_america: 55, middle_east: 280, south_asia: 2000, southeast_asia: 230000, uk_europe: 150, north_america: 200 },
  },
  {
    name: 'Farm Labour Supply (Daily)',
    description: 'Experienced farm workers for planting, weeding, harvesting and general farm work. Reliable and hardworking. Priced per day.',
    image_url: `${PH}/basmati-rice.jpg`,
    prices: { west_africa: 3000, east_africa: 500, southern_africa: 100, north_africa: 90, caribbean: 30, latin_america: 15, middle_east: 80, south_asia: 500, southeast_asia: 60000, uk_europe: 80, north_america: 120 },
  },
  {
    name: 'Drip Irrigation Installation',
    description: 'Professional design and installation of drip irrigation systems. Water-saving, efficient and customised to your farm layout.',
    image_url: `${PH}/solar-install.jpg`,
    prices: { west_africa: 50000, east_africa: 8500, southern_africa: 1600, north_africa: 1400, caribbean: 300, latin_america: 170, middle_east: 800, south_asia: 6000, southeast_asia: 680000, uk_europe: 500, north_america: 700 },
  },
  {
    name: 'Tractor Ploughing (per acre)',
    description: 'Land clearing and ploughing using tractor. Priced per acre. Available for small and large farms. Fast and thorough.',
    image_url: `${PH}/basmati-rice.jpg`,
    prices: { west_africa: 15000, east_africa: 2500, southern_africa: 480, north_africa: 420, caribbean: 90, latin_america: 50, middle_east: 250, south_asia: 1800, southeast_asia: 200000, uk_europe: 150, north_america: 220 },
  },
  {
    name: 'Fish Farm Setup & Management',
    description: 'Complete catfish pond construction, stocking, feed management and harvest planning. From concept to first harvest.',
    image_url: `${PH}/stockfish.jpg`,
    prices: { west_africa: 100000, east_africa: 17000, southern_africa: 3200, north_africa: 2800, caribbean: 600, latin_america: 340, middle_east: 1600, south_asia: 12000, southeast_asia: 1400000, uk_europe: 800, north_america: 1100 },
  },
]

// ─── MASTER LOOKUP ─────────────────────────────────────────────────────────
const SUBCATEGORY_SERVICES: Record<string, ServiceDef[]> = {
  massage: MASSAGE_SERVICES,
  braiding: BRAIDING_SERVICES,
  makeup: MAKEUP_SERVICES,
  nails: NAILS_SERVICES,
  barber: BARBER_SERVICES,
  skincare: SKINCARE_SERVICES,
  wigs: WIGS_SERVICES,
  life_coach: COACHING_SERVICES,
  business_coach: BUSINESS_COACHING_SERVICES,
  womens_empowerment: WOMENS_EMPOWERMENT_SERVICES,
  education: EDUCATION_SERVICES,
  mental_wellness: MENTAL_WELLNESS_SERVICES,
  childcare: CHILDCARE_SERVICES,
  food_catering: FOOD_CATERING_SERVICES,
  health_wellness: HEALTH_WELLNESS_SERVICES,
  domestic: DOMESTIC_SERVICES,
  digital_services: DIGITAL_SERVICES,
  transport: TRANSPORT_SERVICES,
  home_services: HOME_SERVICES,
  events: EVENTS_SERVICES,
  agriculture: AGRICULTURE_SERVICES,
}

// ─── CATEGORY → SUBCATEGORIES FALLBACK ────────────────────────────────────
const CATEGORY_SUBCATEGORY_MAP: Record<string, string[]> = {
  beauty_services: ['massage', 'braiding', 'makeup', 'nails', 'barber', 'skincare', 'wigs'],
  coaching: ['life_coach', 'business_coach', 'womens_empowerment'],
  education: ['education'],
  mental_wellness: ['mental_wellness'],
  childcare: ['childcare'],
  food_catering: ['food_catering'],
  health_wellness: ['health_wellness'],
  domestic: ['domestic'],
  digital_services: ['digital_services'],
  transport: ['transport'],
  home_services: ['home_services'],
  events: ['events'],
  agriculture: ['agriculture'],
}

/**
 * Get sample services for a specific subcategory and country.
 * Returns services with accurate local pricing for the merchant's region.
 */
export function getSampleServicesBySubcategory(subcategoryId: string, countryCode?: string | null): SampleService[] {
  const region = COUNTRY_REGION[countryCode || 'NG'] || 'west_africa'
  const config = REGION_CONFIG[region] || REGION_CONFIG['west_africa']
  const defs = SUBCATEGORY_SERVICES[subcategoryId] || []

  return defs.map(def => {
    const price = def.prices[region] || def.prices['west_africa'] || 5000
    return {
      name: def.name,
      description: def.description,
      price,
      price_display: config.fmt(price),
      in_stock: true,
      image_url: def.image_url,
    }
  })
}

/**
 * Get sample services for a category (uses first matching subcategory).
 * Falls back gracefully.
 */
export function getSampleServices(category: string, countryCode?: string | null): SampleService[] {
  const subcats = CATEGORY_SUBCATEGORY_MAP[category] || []
  if (subcats.length === 0) return []
  // Return first subcategory's services as the category default
  return getSampleServicesBySubcategory(subcats[0], countryCode)
}

/**
 * Get all services for a category (combines all subcategories).
 * Useful for seeding a services merchant with a full catalogue.
 */
export function getAllCategoryServices(category: string, countryCode?: string | null): SampleService[] {
  const subcats = CATEGORY_SUBCATEGORY_MAP[category] || []
  const all: SampleService[] = []
  for (const sub of subcats) {
    all.push(...getSampleServicesBySubcategory(sub, countryCode))
  }
  return all
}

// Legacy export for backward compatibility
export const SAMPLE_SERVICES_BY_SUBCATEGORY = SUBCATEGORY_SERVICES
export const SAMPLE_SERVICES: Record<string, SampleService[]> = {}
