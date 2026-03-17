// Sample products by category with Unsplash images
export const SAMPLE_PRODUCTS: Record<string, Array<{
  name: string
  description: string
  price: number
  price_display: string
  in_stock: boolean
  image_url: string
}>> = {
  food: [
    { name: 'Pounded Yam Flour (5kg)', description: 'Premium pounded yam flour. Smooth, quick to prepare. Perfect for everyday meals and owambe.', price: 450000, price_display: '₦4,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80' },
    { name: 'Palm Oil (4 litres)', description: 'Pure red palm oil, locally processed. Rich colour and flavour for all your soups and stews.', price: 520000, price_display: '₦5,200', in_stock: true, image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
    { name: 'Dried Crayfish (500g)', description: 'High quality dried crayfish, well processed and clean. Adds authentic flavour to egusi and all Nigerian soups.', price: 380000, price_display: '₦3,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80' },
    { name: 'Egusi Seeds (1kg)', description: 'Fresh, well-dried egusi seeds. Perfect for egusi soup and traditional dishes.', price: 420000, price_display: '₦4,200', in_stock: true, image_url: 'https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=400&q=80' },
    { name: 'Basmati Rice (5kg)', description: 'Long grain basmati rice, aromatic and fluffy. Perfect for jollof, fried rice and white rice.', price: 850000, price_display: '₦8,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
    { name: 'Tomato Paste (400g)', description: 'Rich concentrated tomato paste. Perfect base for stews, soups and jollof rice.', price: 120000, price_display: '₦1,200', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  ],
  groceries: [
    { name: 'Indomie Noodles (40 pack)', description: 'Indomie instant noodles, carton of 40 packs. Fast, tasty and filling. Various flavours available.', price: 650000, price_display: '₦6,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80' },
    { name: 'Golden Penny Semolina (2kg)', description: 'Smooth texture semolina, quick to prepare. Great for swallow with any soup.', price: 280000, price_display: '₦2,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
    { name: 'Vegetable Oil (5 litres)', description: 'Pure vegetable cooking oil, 5 litres. Light, healthy and perfect for all types of cooking.', price: 750000, price_display: '₦7,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
    { name: 'Milo (400g tin)', description: 'Nestlé Milo chocolate malt drink, 400g tin. Nutritious and energising. Great for kids and adults.', price: 350000, price_display: '₦3,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400&q=80' },
    { name: 'Sugar (1kg)', description: 'Refined white sugar, 1kg. Perfect for beverages, baking and cooking.', price: 180000, price_display: '₦1,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&q=80' },
    { name: 'Peak Milk (12 tins)', description: 'Peak full cream evaporated milk, carton of 12 tins. Rich and creamy for tea, coffee and cooking.', price: 420000, price_display: '₦4,200', in_stock: true, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80' },
  ],
  fashion: [
    { name: 'Ankara Print Fabric (6 yards)', description: 'Beautiful premium Ankara print fabric, 6 yards. Perfect for aso-ebi and traditional wear. Vibrant colours.', price: 850000, price_display: '₦8,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80' },
    { name: 'Plain Cotton Top (Unisex)', description: 'Soft, breathable cotton top available in multiple colours and sizes. Casual and comfortable.', price: 350000, price_display: '₦3,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
    { name: 'Lace Fabric (5 yards)', description: 'High quality lace fabric, 5 yards. Available in various colours. Ideal for special occasions.', price: 1200000, price_display: '₦12,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    { name: 'Adire Tie-Dye Fabric', description: 'Handmade Yoruba adire fabric. Each piece is unique. Perfect for casual and cultural wear.', price: 650000, price_display: '₦6,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400&q=80' },
    { name: 'Native Agbada Set (Men)', description: 'Traditional Agbada set for men. Embroidered fabric, elegant finish. Available in multiple sizes.', price: 1800000, price_display: '₦18,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { name: 'Aso-Oke Head Tie', description: 'Premium Aso-Oke head tie for women. Rich texture, beautiful finish. Perfect for ceremonies.', price: 450000, price_display: '₦4,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' },
  ],
  electronics: [
    { name: 'Phone Screen Protector', description: 'Universal tempered glass screen protector. Available for all major phone brands. Scratch-resistant.', price: 150000, price_display: '₦1,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
    { name: 'USB-C Charging Cable', description: 'Fast charging USB Type-C cable, 1 metre. Compatible with Android phones and laptops.', price: 120000, price_display: '₦1,200', in_stock: true, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    { name: 'Wireless Earbuds', description: 'Wireless Bluetooth earbuds with charging case. Clear sound, comfortable fit.', price: 350000, price_display: '₦3,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165cd8e?w=400&q=80' },
    { name: 'Power Bank (10000mAh)', description: '10000mAh portable power bank. Charge your phone 3 times on the go. Compact and lightweight.', price: 450000, price_display: '₦4,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80' },
    { name: 'Phone Case (Universal)', description: 'Protective phone case with shock absorption. Available for iPhone and Android. Multiple colours.', price: 180000, price_display: '₦1,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80' },
    { name: 'Bluetooth Speaker', description: 'Portable Bluetooth speaker with 8-hour battery life. Waterproof, powerful bass. Perfect for outdoors.', price: 680000, price_display: '₦6,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80' },
  ],
  beauty: [
    { name: 'Shea Butter (Pure, 500g)', description: 'Raw unrefined shea butter, 500g. Deeply moisturises skin and hair. 100% natural.', price: 250000, price_display: '₦2,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80' },
    { name: 'Black Castor Oil (250ml)', description: 'Jamaican black castor oil, 250ml. Promotes hair growth, strengthens and moisturises.', price: 180000, price_display: '₦1,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80' },
    { name: 'Body Lotion (400ml)', description: 'Moisturising body lotion with Vitamin E. Leaves skin soft, smooth and glowing.', price: 220000, price_display: '₦2,200', in_stock: true, image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80' },
    { name: 'Lipstick Set (6 colours)', description: 'Set of 6 long-lasting matte lipsticks. Rich pigment, smooth application. Suitable for all skin tones.', price: 350000, price_display: '₦3,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2919?w=400&q=80' },
    { name: 'Face Cream (SPF 30)', description: 'Daily moisturising face cream with SPF 30 sun protection. Brightens and evens skin tone.', price: 280000, price_display: '₦2,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80' },
    { name: 'Hair Braiding Extensions', description: 'Premium synthetic braiding hair extensions. Soft, tangle-free. Available in multiple colours.', price: 150000, price_display: '₦1,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
  ],
  shoes: [
    { name: 'Men\'s Canvas Sneakers', description: 'Comfortable canvas sneakers for men. Lightweight, durable and stylish. Sizes 40-46.', price: 650000, price_display: '₦6,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
    { name: 'Ladies\' Block Heels', description: 'Elegant block heel shoes for women. Comfortable for all-day wear. Sizes 36-42.', price: 850000, price_display: '₦8,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80' },
    { name: 'Leather Sandals (Unisex)', description: 'Quality leather sandals, handmade. Durable and comfortable. Perfect for casual occasions.', price: 450000, price_display: '₦4,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80' },
    { name: 'Kids School Shoes', description: 'Durable school shoes for children. Non-slip sole, easy to clean. Sizes 28-38.', price: 380000, price_display: '₦3,800', in_stock: true, image_url: 'https://images.unsplash.com/photo-1514989771522-458c9b6c035a?w=400&q=80' },
    { name: 'Men\'s Formal Shoes', description: 'Classic leather formal shoes for men. Perfect for office and occasions. Sizes 40-46.', price: 1200000, price_display: '₦12,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80' },
    { name: 'Sports Running Shoes', description: 'Lightweight running shoes with cushioned sole. Great for gym, jogging and sports. Unisex.', price: 750000, price_display: '₦7,500', in_stock: true, image_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80' },
  ],
  furniture: [
    { name: 'Office Chair', description: 'Ergonomic office chair with adjustable height and armrests. Comfortable for long hours.', price: 4500000, price_display: '₦45,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80' },
    { name: 'Bedside Table', description: 'Compact bedside table with drawer. Quality wood finish. Fits any bedroom decor.', price: 1800000, price_display: '₦18,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
    { name: '3-Seater Sofa', description: 'Comfortable 3-seater sofa with foam cushions. Durable fabric. Perfect for living room.', price: 12000000, price_display: '₦120,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
    { name: 'Dining Table (4 seats)', description: 'Solid wood dining table with 4 chairs. Elegant design. Perfect for family dining.', price: 8500000, price_display: '₦85,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80' },
  ],
  other: [
    { name: 'Sample Product 1', description: 'Edit this product — add your own name, description and price. Upload a photo to make it look great.', price: 500000, price_display: '₦5,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    { name: 'Sample Product 2', description: 'Edit this product — add your own name, description and price. Upload a photo to make it look great.', price: 300000, price_display: '₦3,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    { name: 'Sample Product 3', description: 'Edit this product — add your own name, description and price. Upload a photo to make it look great.', price: 200000, price_display: '₦2,000', in_stock: true, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
  ],
}

export function getSampleProducts(category: string) {
  return SAMPLE_PRODUCTS[category] || SAMPLE_PRODUCTS['other']
}
