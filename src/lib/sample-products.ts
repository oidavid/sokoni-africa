// Sample products by category — pre-populated when a new store is created
// Prices in kobo (multiply naira by 100)

export const SAMPLE_PRODUCTS: Record<string, Array<{
  name: string
  description: string
  price: number
  price_display: string
  in_stock: boolean
}>> = {
  food: [
    { name: 'Pounded Yam Flour (5kg)', description: 'Premium pounded yam flour. Smooth, quick to prepare. Perfect for everyday meals and owambe.', price: 450000, price_display: '₦4,500', in_stock: true },
    { name: 'Palm Oil (4 litres)', description: 'Pure red palm oil, locally processed. Rich colour and flavour for all your soups and stews.', price: 520000, price_display: '₦5,200', in_stock: true },
    { name: 'Dried Crayfish (500g)', description: 'High quality dried crayfish, well processed and clean. Adds authentic flavour to egusi and all Nigerian soups.', price: 380000, price_display: '₦3,800', in_stock: true },
    { name: 'Egusi Seeds (1kg)', description: 'Fresh, well-dried egusi seeds. Ground or whole available. Perfect for egusi soup and traditional dishes.', price: 420000, price_display: '₦4,200', in_stock: true },
  ],
  fashion: [
    { name: 'Ankara Print Fabric (6 yards)', description: 'Beautiful premium Ankara print fabric, 6 yards. Perfect for aso-ebi, traditional wear, and everyday styles. Vibrant colours that do not fade.', price: 850000, price_display: '₦8,500', in_stock: true },
    { name: 'Plain Cotton Top (Unisex)', description: 'Soft, breathable cotton top available in multiple colours and sizes. Casual and comfortable for everyday wear.', price: 350000, price_display: '₦3,500', in_stock: true },
    { name: 'Lace Fabric (5 yards)', description: 'High quality lace fabric, 5 yards. Available in various colours. Ideal for special occasions and traditional ceremonies.', price: 1200000, price_display: '₦12,000', in_stock: true },
  ],
  groceries: [
    { name: 'Indomie Noodles (40 pack)', description: 'Indomie instant noodles, carton of 40 packs. Fast, tasty and filling. Various flavours available.', price: 650000, price_display: '₦6,500', in_stock: true },
    { name: 'Golden Penny Semolina (2kg)', description: 'Golden Penny semolina, 2kg bag. Smooth texture, quick to prepare. Great for swallow with any soup.', price: 280000, price_display: '₦2,800', in_stock: true },
    { name: 'Vegetable Oil (5 litres)', description: 'Pure vegetable cooking oil, 5 litres. Light, healthy and perfect for all types of cooking and frying.', price: 750000, price_display: '₦7,500', in_stock: true },
  ],
  electronics: [
    { name: 'Phone Screen Protector', description: 'Universal tempered glass screen protector. Available for all major phone brands. Strong, scratch-resistant protection.', price: 150000, price_display: '₦1,500', in_stock: true },
    { name: 'USB Charging Cable (Type-C)', description: 'Fast charging USB Type-C cable, 1 metre. Compatible with Android phones, tablets and laptops.', price: 120000, price_display: '₦1,200', in_stock: true },
    { name: 'Wireless Earbuds', description: 'Wireless Bluetooth earbuds with charging case. Clear sound, comfortable fit. Works with all Bluetooth devices.', price: 350000, price_display: '₦3,500', in_stock: true },
  ],
  beauty: [
    { name: 'Shea Butter (Pure, 500g)', description: 'Raw unrefined shea butter, 500g. Deeply moisturises skin and hair. 100% natural with no additives.', price: 250000, price_display: '₦2,500', in_stock: true },
    { name: 'Black Castor Oil (250ml)', description: 'Jamaican black castor oil, 250ml. Promotes hair growth, strengthens and moisturises. Great for edges and scalp.', price: 180000, price_display: '₦1,800', in_stock: true },
    { name: 'Body Lotion (400ml)', description: 'Moisturising body lotion with Vitamin E. Leaves skin soft, smooth and glowing. Long-lasting fragrance.', price: 220000, price_display: '₦2,200', in_stock: true },
  ],
  shoes: [
    { name: 'Men\'s Canvas Sneakers', description: 'Comfortable canvas sneakers for men. Lightweight, durable and stylish. Available in sizes 40-46.', price: 650000, price_display: '₦6,500', in_stock: true },
    { name: 'Ladies\' Block Heels', description: 'Elegant block heel shoes for women. Comfortable for all-day wear. Available in multiple colours and sizes 36-42.', price: 850000, price_display: '₦8,500', in_stock: true },
    { name: 'Leather Sandals (Unisex)', description: 'Quality leather sandals, handmade. Durable and comfortable. Perfect for casual and semi-formal occasions.', price: 450000, price_display: '₦4,500', in_stock: true },
  ],
  furniture: [
    { name: 'Office Chair', description: 'Ergonomic office chair with adjustable height and armrests. Comfortable for long hours of sitting. Durable and stylish.', price: 4500000, price_display: '₦45,000', in_stock: true },
    { name: 'Bedside Table', description: 'Compact bedside table with drawer. Made from quality wood. Fits any bedroom decor. Easy to assemble.', price: 1800000, price_display: '₦18,000', in_stock: true },
  ],
  other: [
    { name: 'Sample Product 1', description: 'Add your product description here. Tell customers what makes this product special and why they should buy it.', price: 500000, price_display: '₦5,000', in_stock: true },
    { name: 'Sample Product 2', description: 'Add your product description here. Include key details like size, colour, material and any other important information.', price: 300000, price_display: '₦3,000', in_stock: true },
  ],
}

export function getSampleProducts(category: string) {
  return SAMPLE_PRODUCTS[category] || SAMPLE_PRODUCTS['other']
}
