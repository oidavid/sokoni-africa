// Regional placeholder images for products with no uploaded photo
// Uses Unsplash for high-quality, free images
// Organized by region group + category
// Each entry has multiple images — we pick one deterministically based on product name
// so the same product always gets the same image (not random on every reload)

export type RegionGroup =
  | 'west_africa'
  | 'east_africa'
  | 'southern_africa'
  | 'caribbean_latam'
  | 'middle_east'
  | 'europe'
  | 'north_america'
  | 'default'

export type ProductCategory =
  | 'beauty'
  | 'food'
  | 'fashion'
  | 'electronics'
  | 'health'
  | 'furniture'
  | 'shoes'
  | 'other'

// Maps country code → region group
const COUNTRY_TO_REGION: Record<string, RegionGroup> = {
  // West Africa
  GH: 'west_africa', NG: 'west_africa', CI: 'west_africa', SN: 'west_africa',
  GM: 'west_africa', GN: 'west_africa', SL: 'west_africa', LR: 'west_africa',
  BJ: 'west_africa', TG: 'west_africa', BF: 'west_africa', ML: 'west_africa',
  NE: 'west_africa', MR: 'west_africa', CV: 'west_africa', GW: 'west_africa',
  // East Africa
  KE: 'east_africa', TZ: 'east_africa', UG: 'east_africa', RW: 'east_africa',
  ET: 'east_africa', ER: 'east_africa', SO: 'east_africa', DJ: 'east_africa',
  SS: 'east_africa', BI: 'east_africa', MG: 'east_africa', MU: 'east_africa',
  // Southern Africa
  ZA: 'southern_africa', ZW: 'southern_africa', ZM: 'southern_africa',
  BW: 'southern_africa', NA: 'southern_africa', MZ: 'southern_africa',
  MW: 'southern_africa', LS: 'southern_africa', SZ: 'southern_africa',
  // Caribbean & Latin America
  JM: 'caribbean_latam', TT: 'caribbean_latam', BB: 'caribbean_latam',
  GY: 'caribbean_latam', HT: 'caribbean_latam', DO: 'caribbean_latam',
  CU: 'caribbean_latam', BR: 'caribbean_latam', CO: 'caribbean_latam',
  VE: 'caribbean_latam', PE: 'caribbean_latam', EC: 'caribbean_latam',
  BO: 'caribbean_latam', PY: 'caribbean_latam', UY: 'caribbean_latam',
  AR: 'caribbean_latam', CL: 'caribbean_latam', MX: 'caribbean_latam',
  GT: 'caribbean_latam', HN: 'caribbean_latam', SV: 'caribbean_latam',
  NI: 'caribbean_latam', CR: 'caribbean_latam', PA: 'caribbean_latam',
  // Middle East
  AE: 'middle_east', SA: 'middle_east', QA: 'middle_east', KW: 'middle_east',
  OM: 'middle_east', BH: 'middle_east', JO: 'middle_east', LB: 'middle_east',
  IQ: 'middle_east', IR: 'middle_east', SY: 'middle_east', YE: 'middle_east',
  EG: 'middle_east', LY: 'middle_east', TN: 'middle_east', DZ: 'middle_east',
  MA: 'middle_east', SD: 'middle_east', IL: 'middle_east', TR: 'middle_east',
  // Europe
  GB: 'europe', IE: 'europe', FR: 'europe', DE: 'europe', NL: 'europe',
  BE: 'europe', ES: 'europe', PT: 'europe', IT: 'europe', GR: 'europe',
  SE: 'europe', NO: 'europe', DK: 'europe', FI: 'europe', PL: 'europe',
  CZ: 'europe', AT: 'europe', CH: 'europe', HR: 'europe', RO: 'europe',
  // North America + Oceania
  US: 'north_america', CA: 'north_america', AU: 'north_america', NZ: 'north_america',
}

// Maps Earket category slug → ProductCategory
const CATEGORY_MAP: Record<string, ProductCategory> = {
  beauty: 'beauty',
  food: 'food',
  groceries: 'food',
  fashion: 'fashion',
  electronics: 'electronics',
  phones: 'electronics',
  health: 'health',
  health_wellness: 'health',
  furniture: 'furniture',
  shoes: 'shoes',
  stationery: 'other',
  automobile: 'other',
  other: 'other',
}

// The image library — curated Unsplash photo IDs per region + category
// Format: https://images.unsplash.com/photo-{ID}?w=600&q=80&fit=crop
const PLACEHOLDERS: Record<RegionGroup, Record<ProductCategory, string[]>> = {
  west_africa: {
    beauty: [
      'photo-1526045612212-70caf35c14df', // African woman skincare
      'photo-1608248597279-f99d160bfcbc', // natural hair products
      'photo-1571781926291-c477ebfd024b', // shea butter bowls
      'photo-1616394584738-fc6e612e71b9', // skincare flat lay dark skin
      'photo-1522337360788-8b13dee7a37e', // beauty products natural tones
    ],
    food: [
      'photo-1604329760661-e71dc83f8f26', // jollof rice
      'photo-1567364816519-cbc9c4ffe1eb', // African market produce
      'photo-1592417817098-8fd3d9eb14a5', // tropical fruits
      'photo-1518843875459-f738682238a6', // African street food
      'photo-1574484284002-952d92456975', // yam pounded food
    ],
    fashion: [
      'photo-1590735213920-68192a487bc2', // African print fabric woman
      'photo-1550614000-4895a10e1bfd', // kente cloth
      'photo-1529139574466-a303027f1d8b', // African fashion model
      'photo-1509631179647-0177331693ae', // bold print dress
      'photo-1496747611176-843222e1e57c', // fashion model Africa
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9', // smartphone
      'photo-1593642632559-0c6d3fc62b89', // laptop workspace
      'photo-1558618666-fcd25c85cd64', // phone accessories
      'photo-1601524909162-ae8725290836', // mobile phones display
      'photo-1610945415295-d9bbf067e59c', // electronics store
    ],
    health: [
      'photo-1576091160550-2173dba999ef', // herbal remedies
      'photo-1505751172876-fa1923c5c528', // health supplements
      'photo-1498837167922-ddd27525d352', // natural wellness
      'photo-1559181567-c3190100d4f1', // natural herbs
      'photo-1544991936-9464fa6d14c1', // wellness products
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc', // living room warm tones
      'photo-1586023492125-27b2c045efd7', // cozy interior
      'photo-1631679706909-1844bbd07221', // African inspired decor
      'photo-1493663284031-b7e3aefcae8e', // home interior
      'photo-1524758631624-e2822e304c36', // bedroom warm
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', // sneakers
      'photo-1543163521-1bf539c55dd2', // shoe display
      'photo-1515347619252-60a4bf4fff4f', // leather shoes
      'photo-1460353581641-37baddab0fa2', // casual shoes
      'photo-1491553895911-0055eca6402d', // sport shoes
    ],
    other: [
      'photo-1472851294608-062f824d29cc', // market stall
      'photo-1556742049-0cfed4f6a45d', // shop products
      'photo-1607082348824-0a96f2a4b9da', // general store
      'photo-1441986300917-64674bd600d8', // retail display
      'photo-1528698827591-e19ccd7bc23d', // market goods
    ],
  },

  east_africa: {
    beauty: [
      'photo-1616394584738-fc6e612e71b9', // skincare products dark skin
      'photo-1522337360788-8b13dee7a37e', // beauty products
      'photo-1571781926291-c477ebfd024b', // natural skincare
      'photo-1526045612212-70caf35c14df', // face care
      'photo-1608248597279-f99d160bfcbc', // hair products
    ],
    food: [
      'photo-1567364816519-cbc9c4ffe1eb', // fresh produce market
      'photo-1592417817098-8fd3d9eb14a5', // tropical fruits
      'photo-1604329760661-e71dc83f8f26', // rice dish
      'photo-1547592166-23ac45744acd', // spices market
      'photo-1518843875459-f738682238a6', // street food
    ],
    fashion: [
      'photo-1529139574466-a303027f1d8b', // East African fashion
      'photo-1496747611176-843222e1e57c', // model fashion
      'photo-1509631179647-0177331693ae', // dress fashion
      'photo-1590735213920-68192a487bc2', // printed fabric
      'photo-1550614000-4895a10e1bfd', // traditional cloth
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9', // smartphone
      'photo-1593642632559-0c6d3fc62b89', // laptop
      'photo-1601524909162-ae8725290836', // mobile phones
      'photo-1558618666-fcd25c85cd64', // accessories
      'photo-1610945415295-d9bbf067e59c', // electronics
    ],
    health: [
      'photo-1576091160550-2173dba999ef', // natural remedies
      'photo-1505751172876-fa1923c5c528', // supplements
      'photo-1559181567-c3190100d4f1', // herbs
      'photo-1498837167922-ddd27525d352', // wellness
      'photo-1544991936-9464fa6d14c1', // health products
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc', // living room
      'photo-1586023492125-27b2c045efd7', // interior
      'photo-1493663284031-b7e3aefcae8e', // home
      'photo-1524758631624-e2822e304c36', // bedroom
      'photo-1631679706909-1844bbd07221', // decor
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', // sneakers
      'photo-1543163521-1bf539c55dd2', // shoes
      'photo-1515347619252-60a4bf4fff4f', // leather
      'photo-1460353581641-37baddab0fa2', // casual
      'photo-1491553895911-0055eca6402d', // sport
    ],
    other: [
      'photo-1472851294608-062f824d29cc', // market
      'photo-1556742049-0cfed4f6a45d', // shop
      'photo-1607082348824-0a96f2a4b9da', // store
      'photo-1441986300917-64674bd600d8', // retail
      'photo-1528698827591-e19ccd7bc23d', // goods
    ],
  },

  southern_africa: {
    beauty: [
      'photo-1616394584738-fc6e612e71b9', // skincare
      'photo-1522337360788-8b13dee7a37e', // beauty
      'photo-1571781926291-c477ebfd024b', // natural products
      'photo-1526045612212-70caf35c14df', // face
      'photo-1608248597279-f99d160bfcbc', // hair
    ],
    food: [
      'photo-1567364816519-cbc9c4ffe1eb', // produce
      'photo-1592417817098-8fd3d9eb14a5', // fruits
      'photo-1547592166-23ac45744acd', // spices
      'photo-1504674900247-0877df9cc836', // food
      'photo-1518843875459-f738682238a6', // meals
    ],
    fashion: [
      'photo-1529139574466-a303027f1d8b', // fashion
      'photo-1496747611176-843222e1e57c', // model
      'photo-1509631179647-0177331693ae', // dress
      'photo-1590735213920-68192a487bc2', // print
      'photo-1488161628813-04466f872be2', // style
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9', // phone
      'photo-1593642632559-0c6d3fc62b89', // laptop
      'photo-1601524909162-ae8725290836', // mobile
      'photo-1558618666-fcd25c85cd64', // accessories
      'photo-1610945415295-d9bbf067e59c', // electronics
    ],
    health: [
      'photo-1576091160550-2173dba999ef', // remedies
      'photo-1505751172876-fa1923c5c528', // supplements
      'photo-1559181567-c3190100d4f1', // herbs
      'photo-1498837167922-ddd27525d352', // wellness
      'photo-1544991936-9464fa6d14c1', // health
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc', // living room
      'photo-1586023492125-27b2c045efd7', // interior
      'photo-1493663284031-b7e3aefcae8e', // home
      'photo-1524758631624-e2822e304c36', // bedroom
      'photo-1631679706909-1844bbd07221', // decor
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', // sneakers
      'photo-1543163521-1bf539c55dd2', // shoes
      'photo-1515347619252-60a4bf4fff4f', // leather
      'photo-1460353581641-37baddab0fa2', // casual
      'photo-1491553895911-0055eca6402d', // sport
    ],
    other: [
      'photo-1472851294608-062f824d29cc', // market
      'photo-1556742049-0cfed4f6a45d', // shop
      'photo-1607082348824-0a96f2a4b9da', // store
      'photo-1441986300917-64674bd600d8', // retail
      'photo-1528698827591-e19ccd7bc23d', // goods
    ],
  },

  caribbean_latam: {
    beauty: [
      'photo-1522337360788-8b13dee7a37e', // beauty products
      'photo-1616394584738-fc6e612e71b9', // skincare
      'photo-1519415943484-9fa1873496d4', // latina beauty
      'photo-1526045612212-70caf35c14df', // face care
      'photo-1571781926291-c477ebfd024b', // natural beauty
    ],
    food: [
      'photo-1603360946369-dc9bb6258143', // latin food
      'photo-1592417817098-8fd3d9eb14a5', // tropical fruits
      'photo-1547592166-23ac45744acd', // spices
      'photo-1504674900247-0877df9cc836', // food plate
      'photo-1414235077428-338989a2e8c0', // restaurant food
    ],
    fashion: [
      'photo-1529139574466-a303027f1d8b', // fashion
      'photo-1496747611176-843222e1e57c', // model
      'photo-1509631179647-0177331693ae', // dress
      'photo-1434389677669-e08b4cac3105', // colorful fashion
      'photo-1469334031218-e382a71b716b', // runway
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9', // smartphone
      'photo-1593642632559-0c6d3fc62b89', // laptop
      'photo-1601524909162-ae8725290836', // mobile
      'photo-1558618666-fcd25c85cd64', // accessories
      'photo-1519389950473-47ba0277781c', // tech
    ],
    health: [
      'photo-1576091160550-2173dba999ef', // natural remedies
      'photo-1505751172876-fa1923c5c528', // supplements
      'photo-1498837167922-ddd27525d352', // wellness
      'photo-1559181567-c3190100d4f1', // herbs
      'photo-1544991936-9464fa6d14c1', // health
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc', // living room
      'photo-1586023492125-27b2c045efd7', // interior
      'photo-1493663284031-b7e3aefcae8e', // home
      'photo-1524758631624-e2822e304c36', // bedroom
      'photo-1556909114-f6e7ad7d3136', // kitchen
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', // sneakers
      'photo-1543163521-1bf539c55dd2', // shoes
      'photo-1515347619252-60a4bf4fff4f', // leather
      'photo-1460353581641-37baddab0fa2', // casual
      'photo-1491553895911-0055eca6402d', // sport
    ],
    other: [
      'photo-1472851294608-062f824d29cc', // market
      'photo-1556742049-0cfed4f6a45d', // shop
      'photo-1607082348824-0a96f2a4b9da', // store
      'photo-1441986300917-64674bd600d8', // retail
      'photo-1528698827591-e19ccd7bc23d', // goods
    ],
  },

  middle_east: {
    beauty: [
      'photo-1522337360788-8b13dee7a37e', // beauty
      'photo-1571781926291-c477ebfd024b', // skincare
      'photo-1526045612212-70caf35c14df', // face
      'photo-1616394584738-fc6e612e71b9', // products
      'photo-1608248597279-f99d160bfcbc', // hair
    ],
    food: [
      'photo-1547592166-23ac45744acd', // middle eastern spices
      'photo-1504674900247-0877df9cc836', // food
      'photo-1414235077428-338989a2e8c0', // restaurant
      'photo-1567364816519-cbc9c4ffe1eb', // market produce
      'photo-1499028344343-cd173ffc68a9', // arabic food
    ],
    fashion: [
      'photo-1529139574466-a303027f1d8b', // fashion
      'photo-1496747611176-843222e1e57c', // model
      'photo-1509631179647-0177331693ae', // dress
      'photo-1469334031218-e382a71b716b', // style
      'photo-1434389677669-e08b4cac3105', // clothing
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9', // smartphone
      'photo-1593642632559-0c6d3fc62b89', // laptop
      'photo-1519389950473-47ba0277781c', // tech workspace
      'photo-1558618666-fcd25c85cd64', // accessories
      'photo-1610945415295-d9bbf067e59c', // electronics
    ],
    health: [
      'photo-1576091160550-2173dba999ef', // natural
      'photo-1505751172876-fa1923c5c528', // supplements
      'photo-1559181567-c3190100d4f1', // herbs
      'photo-1498837167922-ddd27525d352', // wellness
      'photo-1544991936-9464fa6d14c1', // health
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc', // living room
      'photo-1586023492125-27b2c045efd7', // interior
      'photo-1493663284031-b7e3aefcae8e', // home
      'photo-1524758631624-e2822e304c36', // bedroom
      'photo-1631679706909-1844bbd07221', // decor
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', // sneakers
      'photo-1543163521-1bf539c55dd2', // shoes
      'photo-1515347619252-60a4bf4fff4f', // leather
      'photo-1460353581641-37baddab0fa2', // casual
      'photo-1491553895911-0055eca6402d', // sport
    ],
    other: [
      'photo-1472851294608-062f824d29cc', // market
      'photo-1556742049-0cfed4f6a45d', // shop
      'photo-1607082348824-0a96f2a4b9da', // store
      'photo-1441986300917-64674bd600d8', // retail
      'photo-1528698827591-e19ccd7bc23d', // goods
    ],
  },

  europe: {
    beauty: [
      'photo-1522337360788-8b13dee7a37e', // beauty
      'photo-1571781926291-c477ebfd024b', // skincare
      'photo-1526045612212-70caf35c14df', // face
      'photo-1512290923902-8a9f81dc236c', // cosmetics
      'photo-1598440947619-2c35fc9aa908', // beauty flat lay
    ],
    food: [
      'photo-1504674900247-0877df9cc836', // food
      'photo-1414235077428-338989a2e8c0', // restaurant
      'photo-1555396273-367ea4eb4db5', // european food
      'photo-1484723091739-30a097e8f929', // bakery
      'photo-1467003909585-2f8a72700288', // fresh produce
    ],
    fashion: [
      'photo-1529139574466-a303027f1d8b', // fashion
      'photo-1496747611176-843222e1e57c', // model
      'photo-1469334031218-e382a71b716b', // runway
      'photo-1434389677669-e08b4cac3105', // clothing
      'photo-1488161628813-04466f872be2', // street style
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9', // smartphone
      'photo-1593642632559-0c6d3fc62b89', // laptop
      'photo-1519389950473-47ba0277781c', // tech
      'photo-1498049794561-7780e7231661', // devices
      'photo-1525547719571-a2d4ac8945e2', // computer
    ],
    health: [
      'photo-1505751172876-fa1923c5c528', // supplements
      'photo-1498837167922-ddd27525d352', // wellness
      'photo-1544991936-9464fa6d14c1', // health
      'photo-1559181567-c3190100d4f1', // natural
      'photo-1576091160550-2173dba999ef', // remedies
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc', // living room
      'photo-1586023492125-27b2c045efd7', // interior
      'photo-1493663284031-b7e3aefcae8e', // home
      'photo-1524758631624-e2822e304c36', // bedroom
      'photo-1556909114-f6e7ad7d3136', // kitchen
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', // sneakers
      'photo-1543163521-1bf539c55dd2', // shoes
      'photo-1515347619252-60a4bf4fff4f', // leather
      'photo-1460353581641-37baddab0fa2', // casual
      'photo-1491553895911-0055eca6402d', // sport
    ],
    other: [
      'photo-1472851294608-062f824d29cc', // market
      'photo-1556742049-0cfed4f6a45d', // shop
      'photo-1607082348824-0a96f2a4b9da', // store
      'photo-1441986300917-64674bd600d8', // retail
      'photo-1528698827591-e19ccd7bc23d', // goods
    ],
  },

  north_america: {
    beauty: [
      'photo-1522337360788-8b13dee7a37e', // beauty
      'photo-1571781926291-c477ebfd024b', // skincare
      'photo-1526045612212-70caf35c14df', // face
      'photo-1512290923902-8a9f81dc236c', // cosmetics
      'photo-1598440947619-2c35fc9aa908', // beauty flat lay
    ],
    food: [
      'photo-1504674900247-0877df9cc836', // food
      'photo-1414235077428-338989a2e8c0', // restaurant
      'photo-1467003909585-2f8a72700288', // fresh produce
      'photo-1484723091739-30a097e8f929', // bakery
      'photo-1555396273-367ea4eb4db5', // food display
    ],
    fashion: [
      'photo-1529139574466-a303027f1d8b', // fashion
      'photo-1496747611176-843222e1e57c', // model
      'photo-1469334031218-e382a71b716b', // runway
      'photo-1434389677669-e08b4cac3105', // clothing
      'photo-1488161628813-04466f872be2', // street style
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9', // smartphone
      'photo-1593642632559-0c6d3fc62b89', // laptop
      'photo-1519389950473-47ba0277781c', // tech
      'photo-1498049794561-7780e7231661', // devices
      'photo-1525547719571-a2d4ac8945e2', // computer
    ],
    health: [
      'photo-1505751172876-fa1923c5c528', // supplements
      'photo-1498837167922-ddd27525d352', // wellness
      'photo-1544991936-9464fa6d14c1', // health
      'photo-1559181567-c3190100d4f1', // natural
      'photo-1576091160550-2173dba999ef', // remedies
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc', // living room
      'photo-1586023492125-27b2c045efd7', // interior
      'photo-1493663284031-b7e3aefcae8e', // home
      'photo-1524758631624-e2822e304c36', // bedroom
      'photo-1556909114-f6e7ad7d3136', // kitchen
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff', // sneakers
      'photo-1543163521-1bf539c55dd2', // shoes
      'photo-1515347619252-60a4bf4fff4f', // leather
      'photo-1460353581641-37baddab0fa2', // casual
      'photo-1491553895911-0055eca6402d', // sport
    ],
    other: [
      'photo-1472851294608-062f824d29cc', // market
      'photo-1556742049-0cfed4f6a45d', // shop
      'photo-1607082348824-0a96f2a4b9da', // store
      'photo-1441986300917-64674bd600d8', // retail
      'photo-1528698827591-e19ccd7bc23d', // goods
    ],
  },

  default: {
    beauty: [
      'photo-1522337360788-8b13dee7a37e',
      'photo-1571781926291-c477ebfd024b',
      'photo-1526045612212-70caf35c14df',
      'photo-1512290923902-8a9f81dc236c',
      'photo-1598440947619-2c35fc9aa908',
    ],
    food: [
      'photo-1504674900247-0877df9cc836',
      'photo-1414235077428-338989a2e8c0',
      'photo-1567364816519-cbc9c4ffe1eb',
      'photo-1547592166-23ac45744acd',
      'photo-1592417817098-8fd3d9eb14a5',
    ],
    fashion: [
      'photo-1529139574466-a303027f1d8b',
      'photo-1496747611176-843222e1e57c',
      'photo-1509631179647-0177331693ae',
      'photo-1469334031218-e382a71b716b',
      'photo-1434389677669-e08b4cac3105',
    ],
    electronics: [
      'photo-1511707171634-5f897ff02aa9',
      'photo-1593642632559-0c6d3fc62b89',
      'photo-1519389950473-47ba0277781c',
      'photo-1498049794561-7780e7231661',
      'photo-1525547719571-a2d4ac8945e2',
    ],
    health: [
      'photo-1505751172876-fa1923c5c528',
      'photo-1498837167922-ddd27525d352',
      'photo-1544991936-9464fa6d14c1',
      'photo-1559181567-c3190100d4f1',
      'photo-1576091160550-2173dba999ef',
    ],
    furniture: [
      'photo-1555041469-a586c61ea9bc',
      'photo-1586023492125-27b2c045efd7',
      'photo-1493663284031-b7e3aefcae8e',
      'photo-1524758631624-e2822e304c36',
      'photo-1556909114-f6e7ad7d3136',
    ],
    shoes: [
      'photo-1542291026-7eec264c27ff',
      'photo-1543163521-1bf539c55dd2',
      'photo-1515347619252-60a4bf4fff4f',
      'photo-1460353581641-37baddab0fa2',
      'photo-1491553895911-0055eca6402d',
    ],
    other: [
      'photo-1472851294608-062f824d29cc',
      'photo-1556742049-0cfed4f6a45d',
      'photo-1607082348824-0a96f2a4b9da',
      'photo-1441986300917-64674bd600d8',
      'photo-1528698827591-e19ccd7bc23d',
    ],
  },
}

// Simple hash to pick a consistent image per product name
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash)
}

/**
 * Returns a placeholder image URL for a product with no uploaded photo.
 * Same product name always returns the same image (deterministic).
 *
 * @param productName - The product name (used to deterministically pick image)
 * @param category    - The merchant's store category slug
 * @param countryCode - The merchant's country code (e.g. 'GH', 'NG', 'GB')
 */
export function getPlaceholderImage(
  productName: string,
  category: string | undefined | null,
  countryCode: string | undefined | null
): string {
  const region: RegionGroup = COUNTRY_TO_REGION[countryCode || ''] || 'default'
  const cat: ProductCategory = CATEGORY_MAP[category || ''] || 'other'
  const images = PLACEHOLDERS[region][cat]
  const index = hashString(productName) % images.length
  const photoId = images[index]
  return `https://images.unsplash.com/${photoId}?w=600&q=80&fit=crop&auto=format`
}
