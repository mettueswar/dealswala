const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Admin user
  const hashed = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dealwala.in' },
    update: {},
    create: { email: 'admin@dealwala.in', password: hashed, name: 'Admin', role: 'admin' },
  });
  console.log('Admin:', admin.email);

  // Categories
  const cats = [
    { name: 'Electronics', slug: 'electronics', icon: '💻', order: 1 },
    { name: 'Fashion', slug: 'fashion', icon: '👗', order: 2 },
    { name: 'Food & Dining', slug: 'food', icon: '🍔', order: 3 },
    { name: 'Travel', slug: 'travel', icon: '✈️', order: 4 },
    { name: 'Beauty', slug: 'beauty', icon: '💄', order: 5 },
    { name: 'Grocery', slug: 'grocery', icon: '🛒', order: 6 },
    { name: 'Mobile', slug: 'mobile', icon: '📱', order: 7 },
    { name: 'Home & Living', slug: 'home', icon: '🏠', order: 8 },
  ];
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  console.log('Categories seeded');

  const elec = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const fashion = await prisma.category.findUnique({ where: { slug: 'fashion' } });
  const food = await prisma.category.findUnique({ where: { slug: 'food' } });
  const travel = await prisma.category.findUnique({ where: { slug: 'travel' } });

  // Stores
  const storesData = [
    {
      name: 'Amazon India', slug: 'amazon', logo: '📦', website: 'https://amazon.in',
      affLink: 'https://amazon.in?tag=dealwala', featured: true, categoryId: elec.id,
      shortDesc: "India's largest online marketplace with millions of products across every category.",
      longDesc: `<h2>About Amazon India</h2><p>Amazon India is one of the country's most trusted e-commerce platforms, offering everything from electronics and fashion to groceries and home essentials.</p><p>With Prime membership, shoppers get access to fast free delivery, exclusive deals, and streaming content. The platform hosts thousands of verified sellers and brands, ensuring competitive pricing and authentic products.</p><ul><li>Fast delivery with Amazon Prime</li><li>Easy returns within 30 days</li><li>A-to-Z Guarantee on all orders</li><li>EMI options on major banks</li></ul>`,
    },
    {
      name: 'Flipkart', slug: 'flipkart', logo: '🛒', website: 'https://flipkart.com',
      affLink: 'https://flipkart.com?affid=dealwala', featured: true, categoryId: elec.id,
      shortDesc: "India's homegrown e-commerce giant, known for Big Billion Days and unbeatable deals.",
      longDesc: `<h2>About Flipkart</h2><p>Flipkart has been transforming Indian online shopping since 2007. Known for hosting India's biggest sales events including Big Billion Days, it offers competitive prices across fashion, electronics, and home goods.</p><p>With a strong logistics network and easy returns policy, Flipkart serves millions of customers across tier-1 and tier-2 cities. Flipkart Plus members enjoy exclusive early access to sales.</p><ul><li>Big Billion Days — India's biggest sale</li><li>Flipkart Plus loyalty program</li><li>No-cost EMI on 100+ banks</li><li>SuperCoin rewards on every purchase</li></ul>`,
    },
    {
      name: 'Myntra', slug: 'myntra', logo: '👗', website: 'https://myntra.com',
      affLink: 'https://myntra.com?affid=dealwala', featured: true, categoryId: fashion.id,
      shortDesc: "India's leading online fashion destination for brands, styles and trends.",
      longDesc: `<h2>About Myntra</h2><p>Myntra is India's fashion-first e-commerce platform featuring 5000+ brands from premium to affordable. Whether you're looking for ethnic wear, western outfits, or sportswear, Myntra has it all.</p><p>Regular sales like End of Reason Sale (EORS) offer massive discounts. The Myntra Insider program rewards loyal shoppers with exclusive access and perks.</p><ul><li>5000+ national and international brands</li><li>Free delivery on orders above ₹799</li><li>Easy 30-day returns</li><li>Myntra Insider loyalty rewards</li></ul>`,
    },
    {
      name: 'Zomato', slug: 'zomato', logo: '🍔', website: 'https://zomato.com',
      affLink: 'https://zomato.com?affid=dealwala', featured: false, categoryId: food.id,
      shortDesc: 'Order food from your favourite restaurants with quick delivery across India.',
      longDesc: `<h2>About Zomato</h2><p>Zomato is India's top food delivery platform connecting millions of users with over 3,00,000 restaurant partners. Whether you want biryani, pizza, or healthy salads, it arrives at your door in under 30 minutes.</p><p>Zomato Pro membership offers up to 30% off every order. The platform also features dining-out offers and discovery features for foodies across India.</p><ul><li>Order from 3,00,000+ restaurants</li><li>30-minute delivery guarantee</li><li>Zomato Pro for extra savings</li><li>Gold dining-out benefits</li></ul>`,
    },
    {
      name: 'MakeMyTrip', slug: 'makemytrip', logo: '✈️', website: 'https://makemytrip.com',
      affLink: 'https://makemytrip.com?affid=dealwala', featured: false, categoryId: travel.id,
      shortDesc: 'Book flights, hotels, and holiday packages at the best prices across India.',
      longDesc: `<h2>About MakeMyTrip</h2><p>MakeMyTrip is India's leading travel company offering flights, hotels, holiday packages, bus and train bookings all in one place. With over 20 years of experience, it's the most trusted travel platform in India.</p><p>Regular promotions on domestic and international flights make it the go-to app for budget-conscious travellers. MyRewards program lets you earn and redeem points on every booking.</p><ul><li>Flights, hotels, packages all in one place</li><li>Best price guarantee</li><li>MyRewards loyalty program</li><li>24/7 customer support</li></ul>`,
    },
  ];
  for (const s of storesData) {
    await prisma.store.upsert({ where: { slug: s.slug }, update: {}, create: s });
  }
  console.log('Stores seeded');

  const amazon = await prisma.store.findUnique({ where: { slug: 'amazon' } });
  const flipkart = await prisma.store.findUnique({ where: { slug: 'flipkart' } });
  const myntra = await prisma.store.findUnique({ where: { slug: 'myntra' } });
  const zomato = await prisma.store.findUnique({ where: { slug: 'zomato' } });
  const mmt = await prisma.store.findUnique({ where: { slug: 'makemytrip' } });

  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Deals
  const dealsData = [
    { title: 'Up to 60% Off on Electronics', slug: 'amazon-60-off-electronics', description: 'Save big on laptops, mobiles, tablets and accessories during the Great Indian Sale. No coupon needed.', discount: '60% OFF', affLink: amazon.affLink, storeId: amazon.id, categoryId: elec.id, verified: true, featured: true, expiresAt: future },
    { title: 'Free Delivery on All Orders', slug: 'amazon-free-delivery', description: 'No minimum order value. Free delivery across India with Amazon Prime 30-day trial. Activate now.', discount: 'FREE DELIVERY', affLink: amazon.affLink, storeId: amazon.id, categoryId: elec.id, verified: true, featured: false, expiresAt: week },
    { title: 'Big Billion Days — All Categories', slug: 'flipkart-big-billion', description: 'Flipkart\'s biggest sale of the year. Up to 80% off on mobiles, TVs, appliances, fashion and more.', discount: '80% OFF', affLink: flipkart.affLink, storeId: flipkart.id, categoryId: elec.id, verified: true, featured: true, expiresAt: future },
    { title: 'End of Reason Sale — Fashion', slug: 'myntra-eors', description: 'Myntra\'s biggest fashion sale twice a year. Flat 50-80% off on 5000+ brands. Best time to shop.', discount: '80% OFF', affLink: myntra.affLink, storeId: myntra.id, categoryId: fashion.id, verified: true, featured: true, expiresAt: future },
    { title: 'Free Delivery on All Restaurant Orders', slug: 'zomato-free-delivery', description: 'Enjoy free delivery on all orders this weekend. Valid on orders above ₹199 from select restaurants.', discount: 'FREE DELIVERY', affLink: zomato.affLink, storeId: zomato.id, categoryId: food.id, verified: false, featured: false, expiresAt: week },
    { title: 'Domestic Flight Fares from ₹999', slug: 'mmt-flights-999', description: 'Book domestic flights at unbeatable fares starting ₹999. Limited seats. Book now before they fill up.', discount: 'FROM ₹999', affLink: mmt.affLink, storeId: mmt.id, categoryId: travel.id, verified: true, featured: false, expiresAt: week },
  ];
  for (const d of dealsData) {
    await prisma.deal.upsert({ where: { slug: d.slug }, update: {}, create: d });
  }

  // Coupons
  const couponsData = [
    { title: 'Flat ₹200 Off on ₹999+', slug: 'amazon-flat200', code: 'AMZNEW200', description: 'Apply at checkout on any category. Min order ₹999. Valid on select products. New users get extra 5% off.', discount: '₹200 OFF', affLink: amazon.affLink, storeId: amazon.id, categoryId: elec.id, verified: true, featured: true, expiresAt: future },
    { title: 'Extra 10% Off via HDFC Card', slug: 'amazon-hdfc10', code: 'HDFC10AMZ', description: 'Instant 10% additional discount when paying with HDFC Debit or Credit card. Max discount ₹1500.', discount: '10% EXTRA', affLink: amazon.affLink, storeId: amazon.id, categoryId: elec.id, verified: true, featured: false, expiresAt: week },
    { title: 'Flat ₹200 Off on Fashion', slug: 'flipkart-fashion200', code: 'FLIP200', description: 'Apply coupon at checkout on Fashion & Lifestyle orders above ₹999. Excludes premium brands.', discount: '₹200 OFF', affLink: flipkart.affLink, storeId: flipkart.id, categoryId: fashion.id, verified: true, featured: true, expiresAt: future },
    { title: '10% Cashback via SuperCoin', slug: 'flipkart-supercoin', code: 'SUPER10', description: 'Additional 10% instant discount when paying with HDFC Debit/Credit card. Capped at ₹500.', discount: '10% CASHBACK', affLink: flipkart.affLink, storeId: flipkart.id, categoryId: elec.id, verified: true, featured: false, expiresAt: future },
    { title: '30% Off — New Users', slug: 'myntra-new30', code: 'STYLE30', description: 'New to Myntra? Get 30% off your very first order with this exclusive code. Max discount ₹300.', discount: '30% OFF', affLink: myntra.affLink, storeId: myntra.id, categoryId: fashion.id, verified: true, featured: true, expiresAt: future },
    { title: '50% Off First 3 Orders', slug: 'zomato-first50', code: 'FEAST50', description: 'New users get 50% off on first three orders. Max discount ₹100 per order. Auto-applied at checkout.', discount: '50% OFF', affLink: zomato.affLink, storeId: zomato.id, categoryId: food.id, verified: true, featured: true, expiresAt: future },
    { title: '₹500 Off First Hotel Booking', slug: 'mmt-hotel500', code: 'MMTHOTEL', description: 'Get ₹500 off on your first hotel booking via MakeMyTrip. Min booking value ₹2000. Domestic only.', discount: '₹500 OFF', affLink: mmt.affLink, storeId: mmt.id, categoryId: travel.id, verified: true, featured: false, expiresAt: future },
    { title: 'Flat 20% Off on Zomato Pro', slug: 'zomato-pro20', code: 'ZPRO20', description: 'Subscribe to Zomato Pro at 20% off and enjoy unlimited free deliveries + restaurant discounts.', discount: '20% OFF', affLink: zomato.affLink, storeId: zomato.id, categoryId: food.id, verified: false, featured: false, expiresAt: week },
  ];
  for (const c of couponsData) {
    await prisma.coupon.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  console.log('Deals & Coupons seeded');
  console.log('Seed complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
