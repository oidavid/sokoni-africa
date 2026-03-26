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
export function getPlaceholderImage(
  productId: string,
  category: string | undefined | null,
  countryCode: string | undefined | null
): string {
  const region: Region = COUNTRY_REGION[countryCode || ''] || 'global'
  const cat = (category || 'other') as Category
  const regionImages = PLACEHOLDER_IMAGES[region]
  const images =
    regionImages[cat] ||
    regionImages['other'] ||
    PLACEHOLDER_IMAGES.global.other!

  // Use last char of product ID to pick consistently (same product = same image)
  const lastChar = productId ? productId.charCodeAt(productId.length - 1) : 0
  return images[lastChar % images.length]
}
