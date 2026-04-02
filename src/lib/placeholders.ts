/**
 * Earket Regional Placeholder Images
 * 
 * High-quality Unsplash images organized by region + category.
 * Used when a merchant has not uploaded a product photo.
 * 
 * Region groups:
 *   west_africa   — Ghana, Nigeria, Ivory Coast, Senegal, etc.
 *   east_africa   — Kenya, Tanzania, Uganda, Ethiopia, Rwanda
 *   southern_africa — South Africa, Zimbabwe, Zambia, Mozambique
 *   north_africa  — Egypt, Morocco, Tunisia, Algeria
 *   caribbean     — Jamaica, Trinidad, Haiti, Dominican Republic
 *   latin_america — Brazil, Colombia, Mexico, Peru, Argentina
 *   middle_east   — UAE, Saudi Arabia, Jordan, Lebanon
 *   south_asia    — India, Pakistan, Bangladesh, Sri Lanka
 *   southeast_asia — Indonesia, Philippines, Vietnam, Malaysia
 *   east_asia     — China, Japan, South Korea, Taiwan
 *   uk_europe     — UK, France, Germany, Netherlands
 *   north_america — US, Canada
 *   global        — fallback for any unlisted country
 */

type Category =
  | 'beauty'
  | 'food'
  | 'fashion'
  | 'electronics'
  | 'health'
  | 'furniture'
  | 'shoes'
  | 'groceries'
  | 'phones'
  | 'automobile'
  | 'stationery'
  | 'other'
  // Service categories
  | 'beauty_services'
  | 'hair_salon'
  | 'auto_services'
  | 'home_services'
  | 'digital_services'
  | 'education'
  | 'health_wellness'
  | 'mental_wellness'
  | 'coaching'
  | 'food_catering'
  | 'domestic'
  | 'events'
  | 'transport'
  | 'childcare'
  | 'agriculture'
  | 'fashion_design'
  | 'photography'
  | 'legal_finance'
  | 'real_estate'
  | 'printing'
  | 'security'
  | 'fitness'
  | 'music'

type Region =
  | 'west_africa'
  | 'east_africa'
  | 'southern_africa'
  | 'north_africa'
  | 'caribbean'
  | 'latin_america'
  | 'middle_east'
  | 'south_asia'
  | 'southeast_asia'
  | 'east_asia'
  | 'uk_europe'
  | 'north_america'
  | 'global'

// Country code → region mapping
const COUNTRY_REGION: Record<string, Region> = {
  // West Africa
  NG: 'west_africa', GH: 'west_africa', CI: 'west_africa', SN: 'west_africa',
  GM: 'west_africa', GN: 'west_africa', SL: 'west_africa', LR: 'west_africa',
  TG: 'west_africa', BJ: 'west_africa', BF: 'west_africa', ML: 'west_africa',
  NE: 'west_africa', MR: 'west_africa', CV: 'west_africa', GW: 'west_africa',
  // East Africa
  KE: 'east_africa', TZ: 'east_africa', UG: 'east_africa', ET: 'east_africa',
  RW: 'east_africa', BI: 'east_africa', SS: 'east_africa', SO: 'east_africa',
  ER: 'east_africa', DJ: 'east_africa', MG: 'east_africa', MU: 'east_africa',
  // Southern Africa
  ZA: 'southern_africa', ZW: 'southern_africa', ZM: 'southern_africa',
  MZ: 'southern_africa', BW: 'southern_africa', NA: 'southern_africa',
  LS: 'southern_africa', SZ: 'southern_africa', AO: 'southern_africa',
  // North Africa
  EG: 'north_africa', MA: 'north_africa', TN: 'north_africa', DZ: 'north_africa',
  LY: 'north_africa', SD: 'north_africa',
  // Caribbean
  JM: 'caribbean', TT: 'caribbean', HT: 'caribbean', DO: 'caribbean',
  BB: 'caribbean', GY: 'caribbean', SR: 'caribbean',
  // Latin America
  BR: 'latin_america', CO: 'latin_america', MX: 'latin_america', PE: 'latin_america',
  AR: 'latin_america', CL: 'latin_america', EC: 'latin_america', BO: 'latin_america',
  PY: 'latin_america', UY: 'latin_america', VE: 'latin_america', CR: 'latin_america',
  PA: 'latin_america', GT: 'latin_america', HN: 'latin_america', NI: 'latin_america',
  SV: 'latin_america',
  // Middle East
  AE: 'middle_east', SA: 'middle_east', KW: 'middle_east', QA: 'middle_east',
  OM: 'middle_east', JO: 'middle_east', LB: 'middle_east', IQ: 'middle_east',
  YE: 'middle_east', SY: 'middle_east', IL: 'middle_east',
  // South Asia
  IN: 'south_asia', PK: 'south_asia', BD: 'south_asia', LK: 'south_asia',
  NP: 'south_asia', AF: 'south_asia',
  // Southeast Asia
  ID: 'southeast_asia', PH: 'southeast_asia', VN: 'southeast_asia', MY: 'southeast_asia',
  TH: 'southeast_asia', MM: 'southeast_asia', KH: 'southeast_asia', SG: 'southeast_asia',
  // East Asia
  CN: 'east_asia', JP: 'east_asia', KR: 'east_asia', TW: 'east_asia', HK: 'east_asia',
  // UK & Europe
  GB: 'uk_europe', FR: 'uk_europe', DE: 'uk_europe', NL: 'uk_europe', BE: 'uk_europe',
  IT: 'uk_europe', ES: 'uk_europe', PT: 'uk_europe', IE: 'uk_europe', SE: 'uk_europe',
  NO: 'uk_europe', DK: 'uk_europe', FI: 'uk_europe', AT: 'uk_europe', CH: 'uk_europe',
  PL: 'uk_europe', CZ: 'uk_europe', RO: 'uk_europe', HU: 'uk_europe', GR: 'uk_europe',
  // North America
  US: 'north_america', CA: 'north_america',
  // East Europe / Central Asia
  RU: 'global', UA: 'global', KZ: 'global', UZ: 'global',
  // Oceania
  AU: 'global', NZ: 'global',
}

// Each region+category gets 6 image URLs — randomly picked at render time
// so product grids look varied rather than all showing the same image.
// Images are 800x800 Unsplash photos, free to use.
const PLACEHOLDER_IMAGES: Record<Region, Partial<Record<Category, string[]>>> = {

  // ─── WEST AFRICA ──────────────────────────────────────────────────────────
  west_africa: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', // skincare flatlay dark skin
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80', // shea butter natural
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80', // black woman skincare
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80', // beauty products
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80', // natural oils
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80', // cosmetics
    ],
    food: [
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80', // jollof rice
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', // african food
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80', // tropical fruit
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', // soup stew
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', // food market
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80', // grilled meat
    ],
    fashion: [
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80', // african print fabric
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', // black woman fashion
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80', // ankara fashion
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80', // colourful clothing
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', // fashion model
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80', // fabric market
    ],
    groceries: [
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80', // tropical produce
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80', // market vegetables
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', // fresh produce
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80', // pantry items
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80', // market stall
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80', // spices
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80', // supplements
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80', // herbal medicine
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80', // natural health
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80', // wellness
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80', // vitamins
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80', // health products
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80', // electronics
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80', // gadgets
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80', // tech products
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', // laptop
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', // tech setup
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80', // smartwatch
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', // smartphone
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80', // phone flatlay
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', // mobile phone
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', // phone accessories
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', // phone display
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80', // phones
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // sneakers
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80', // shoes flatlay
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80', // trainers
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80', // fashion shoes
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80', // heels
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80', // leather shoes
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', // sofa
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', // bedroom
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80', // living room
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', // furniture
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80', // chair
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80', // table
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', // car
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80', // auto parts
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // car accessories
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80', // vehicle
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', // car detail
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80', // auto
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80', // desk stationery
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80', // notebooks
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80', // pens
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80', // office supplies
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', // stationery flatlay
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', // school supplies
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80', // market
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', // shopping
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', // gift
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80', // products
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', // retail
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // store
    ],
  },

  // ─── EAST AFRICA ──────────────────────────────────────────────────────────
  east_africa: {
    beauty: [
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── SOUTHERN AFRICA ──────────────────────────────────────────────────────
  southern_africa: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── NORTH AFRICA ─────────────────────────────────────────────────────────
  north_africa: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── MIDDLE EAST ──────────────────────────────────────────────────────────
  middle_east: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── CARIBBEAN ────────────────────────────────────────────────────────────
  caribbean: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── LATIN AMERICA ────────────────────────────────────────────────────────
  latin_america: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── SOUTH ASIA ───────────────────────────────────────────────────────────
  south_asia: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── SOUTHEAST ASIA ───────────────────────────────────────────────────────
  southeast_asia: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── EAST ASIA ────────────────────────────────────────────────────────────
  east_asia: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── UK & EUROPE ──────────────────────────────────────────────────────────
  uk_europe: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── NORTH AMERICA ────────────────────────────────────────────────────────
  north_america: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },

  // ─── GLOBAL FALLBACK ──────────────────────────────────────────────────────
  global: {
    beauty: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486784-74757ac4a559?w=800&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80',
      'https://images.unsplash.com/photo-1600612253971-7b4b72edfd09?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
      'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=800&q=80',
    ],
    food: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    groceries: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80',
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80',
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    ],
    phones: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&q=80',
    ],
    shoes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1518894781321-630e638d0742?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    ],
    furniture: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    automobile: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    stationery: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80',
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&q=80',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
    other: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    ],
    // ── SERVICE CATEGORIES (global, used across all regions) ────────────────
    beauty_services: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    ],
    hair_salon: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
      'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80',
      'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&q=80',
    ],
    auto_services: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80',
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    ],
    home_services: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    ],
    digital_services: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    ],
    education: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    ],
    health_wellness: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    ],
    mental_wellness: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
    ],
    coaching: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    ],
    food_catering: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    ],
    domestic: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
    ],
    events: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    ],
    transport: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
      'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
      'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    childcare: [
      'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=800&q=80',
      'https://images.unsplash.com/photo-1567705323043-dce7c5d78a83?w=800&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    ],
    agriculture: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
      'https://images.unsplash.com/photo-1592982537447-6f2a6a0a7b2b?w=800&q=80',
    ],
    fashion_design: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
      'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&q=80',
      'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    ],
    photography: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
      'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
      'https://images.unsplash.com/photo-1471341971476-ae15196e2a7a?w=800&q=80',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    ],
    legal_finance: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&q=80',
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&q=80',
    ],
    real_estate: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80',
    ],
    printing: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80',
      'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&q=80',
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
    ],
    security: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80',
      'https://images.unsplash.com/photo-1618060932014-4deda4932554?w=800&q=80',
      'https://images.unsplash.com/photo-1564636030-0a6d75ccab79?w=800&q=80',
      'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=800&q=80',
      'https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=800&q=80',
    ],
    fitness: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
      'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
    ],
    music: [
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80',
    ],
  },
}

/**
 * Get a placeholder image URL for a product with no image.
 * Picks deterministically from the pool based on product ID so
 * the same product always shows the same placeholder.
 *
 * @param productId  - product UUID (used to pick consistently)
 * @param category   - merchant store category
 * @param countryCode - merchant ISO country code (e.g. 'GH', 'NG')
 */
const SERVICE_CATEGORIES = new Set([
  'beauty_services', 'hair_salon', 'auto_services', 'home_services',
  'digital_services', 'education', 'health_wellness', 'mental_wellness',
  'coaching', 'food_catering', 'domestic', 'events', 'transport',
  'childcare', 'agriculture', 'fashion_design', 'photography',
  'legal_finance', 'real_estate', 'printing', 'security', 'fitness', 'music',
])

export function getPlaceholderImage(
  productId: string,
  category: string | undefined | null,
  countryCode: string | undefined | null
): string {
  const cat = (category || 'other') as Category

  // Service categories use the global pool (not region-specific)
  const isService = SERVICE_CATEGORIES.has(cat)
  const region: Region = isService ? 'global' : (COUNTRY_REGION[countryCode || ''] || 'global')

  const regionImages = PLACEHOLDER_IMAGES[region]
  const images =
    regionImages[cat] ||
    (isService ? PLACEHOLDER_IMAGES.global.other! : (regionImages['other'] || PLACEHOLDER_IMAGES.global.other!))

  // Use last char of product ID to pick consistently (same product = same image)
  const lastChar = productId ? productId.charCodeAt(productId.length - 1) : 0
  return images[lastChar % images.length]
}
