/**
 * seeds/seed.js
 * Run with: node seeds/seed.js
 * Seeds the database with initial data for development.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const connectDB = require('../config/db');

const {
  User, Seller, Category, Product, Review, Cart,
} = require('../models');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed…');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Seller.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Cart.deleteMany({}),
  ]);
  console.log('✓ Cleared existing data');

  /* ── 1. Admin user ── */
  const admin = await User.create({
    fullName:   'MHD Admin',
    email:      'admin@mhdstore.com',
    password:   'Admin@1234',
    role:       'admin',
    isVerified: true,
  });
  console.log('✓ Admin created:', admin.email);

  /* ── 2. Seller users ── */
  const sellerUsers = await User.insertMany([
    { fullName:'Sophie Laurent', email:'sophie@maisonelite.com', password: await bcrypt.hash('Password@1',12), role:'seller', isVerified:true },
    { fullName:'James Morin',    email:'james@craftandhide.com', password: await bcrypt.hash('Password@1',12), role:'seller', isVerified:true },
    { fullName:'Aiko Kimura',    email:'aiko@ateliernord.com',   password: await bcrypt.hash('Password@1',12), role:'seller', isVerified:true },
  ]);
  console.log(`✓ ${sellerUsers.length} seller users created`);

  /* ── 3. Customer users ── */
  await User.insertMany([
    { fullName:'Alice Martin',  email:'alice@example.com',  password: await bcrypt.hash('Password@1',12), role:'customer', isVerified:true },
    { fullName:'Bob Wilson',    email:'bob@example.com',    password: await bcrypt.hash('Password@1',12), role:'customer', isVerified:true },
    { fullName:'Clara Dubois',  email:'clara@example.com',  password: await bcrypt.hash('Password@1',12), role:'customer', isVerified:true },
  ]);
  console.log('✓ Customer users created');

  /* ── 4. Sellers ── */
  const sellers = await Seller.insertMany([
    {
      user: sellerUsers[0]._id, storeName:'Maison Élite', storeSlug:'maison-elite',
      description:'Luxury fashion and apparel from independent designers.',
      category:'Fashion & Apparel', phone:'+33 1 00 00 0001',
      email:'sophie@maisonelite.com', country:'France', city:'Paris',
      status:'approved', approvedAt: new Date(),
      metrics:{ totalProducts:12, averageRating:4.9, reviewCount:89 },
    },
    {
      user: sellerUsers[1]._id, storeName:'Craft & Hide', storeSlug:'craft-and-hide',
      description:'Premium leather goods handcrafted in small batches.',
      category:'Fashion & Apparel', phone:'+1 555 000 0002',
      email:'james@craftandhide.com', country:'United States', city:'New York',
      status:'approved', approvedAt: new Date(),
      metrics:{ totalProducts:8, averageRating:4.7, reviewCount:203 },
    },
    {
      user: sellerUsers[2]._id, storeName:'Atelier Nord', storeSlug:'atelier-nord',
      description:'Scandinavian-inspired ceramics and homeware.',
      category:'Home & Living', phone:'+47 000 00 000',
      email:'aiko@ateliernord.com', country:'Norway', city:'Oslo',
      status:'approved', approvedAt: new Date(),
      metrics:{ totalProducts:15, averageRating:4.6, reviewCount:61 },
    },
  ]);
  console.log(`✓ ${sellers.length} sellers created`);

  /* ── 5. Categories ── */
  const categories = await Category.insertMany([
    { name:'Fashion & Apparel', slug:'fashion',      description:'Clothing, accessories and footwear.', sortOrder:1, productCount:3240 },
    { name:'Electronics',       slug:'electronics',  description:'Gadgets, audio and smart devices.',   sortOrder:2, productCount:1890 },
    { name:'Home & Living',     slug:'home-living',  description:'Artisan homeware and décor.',         sortOrder:3, productCount:2105 },
    { name:'Beauty & Care',     slug:'beauty',       description:'Clean beauty and skincare.',          sortOrder:4, productCount:987  },
    { name:'Sports & Outdoor',  slug:'sports',       description:'Performance gear and equipment.',     sortOrder:5, productCount:1450 },
    { name:'Art & Collectibles',slug:'art',          description:'Original artworks and prints.',       sortOrder:6, productCount:634  },
  ]);
  console.log(`✓ ${categories.length} categories created`);

  const [fashion, , homeLiving] = categories;

  /* ── 6. Products ── */
  const products = await Product.insertMany([
    {
      seller: sellers[0]._id, category: fashion._id,
      name:'Cashmere Blend Overcoat — Midnight', slug:'cashmere-blend-overcoat-midnight',
      description:'Crafted from a luxurious blend of 90% cashmere and 10% silk. Hand-finished in Milan with mother-of-pearl buttons.',
      shortDesc:'Luxurious cashmere overcoat, hand-finished in Milan.',
      price:349, originalPrice:480, images:[], stock:8,
      hasVariants:true,
      variants:[
        { name:'Size', options:[
          {value:'XS',stock:2},{value:'S',stock:2},{value:'M',stock:2},
          {value:'L',stock:1},{value:'XL',stock:1},
        ]},
        { name:'Color', options:[
          {value:'Midnight',stock:8},{value:'Camel',stock:5},{value:'Ivory',stock:3},
        ]},
      ],
      details:[
        {label:'Material',value:'90% Cashmere, 10% Silk'},
        {label:'Lining',value:'Bemberg Cupro'},
        {label:'Origin',value:'Made in Italy'},
        {label:'Care',value:'Dry clean only'},
      ],
      tags:['cashmere','overcoat','luxury','winter'],
      badge:'New', rating:4.9, reviewCount:128,
      status:'active', isApproved:true, isFeatured:true,
      salesCount:47,
    },
    {
      seller: sellers[1]._id, category: fashion._id,
      name:'Leather Bifold Wallet — Cognac', slug:'leather-bifold-wallet-cognac',
      description:'Full-grain vegetable-tanned leather. Handstitched in small batches in Brooklyn.',
      shortDesc:'Full-grain leather wallet, handstitched in Brooklyn.',
      price:95, originalPrice:130, images:[], stock:34,
      tags:['leather','wallet','accessories'],
      badge:'Sale', rating:4.7, reviewCount:203,
      status:'active', isApproved:true, isFeatured:true,
      salesCount:89,
    },
    {
      seller: sellers[2]._id, category: homeLiving._id,
      name:'Hand-Thrown Ceramic Vase Set', slug:'hand-thrown-ceramic-vase-set',
      description:'Each piece is individually hand-thrown on the wheel in our Oslo studio. No two are exactly alike.',
      shortDesc:'Individually hand-thrown ceramic vases from Oslo.',
      price:124, images:[], stock:12,
      tags:['ceramic','vase','homeware','handmade'],
      rating:4.6, reviewCount:61,
      status:'active', isApproved:true,
      salesCount:28,
    },
  ]);
  console.log(`✓ ${products.length} products created`);

  /* ── 7. Reviews ── */
  const customers = await User.find({ role:'customer' });
  await Review.insertMany([
    {
      product: products[0]._id, user: customers[0]._id,
      seller: sellers[0]._id,   order: new mongoose.Types.ObjectId(),
      rating:5, title:'Absolutely impeccable',
      comment:'The cashmere is impossibly soft and the cut is perfection. Worth every penny.',
      isVerified:true,
    },
    {
      product: products[0]._id, user: customers[1]._id,
      seller: sellers[0]._id,   order: new mongoose.Types.ObjectId(),
      rating:5, title:'Exceeded every expectation',
      comment:'The midnight colour is even richer in person. Packaging was exceptional.',
      isVerified:true,
    },
    {
      product: products[1]._id, user: customers[2]._id,
      seller: sellers[1]._id,   order: new mongoose.Types.ObjectId(),
      rating:5, title:'Perfect everyday wallet',
      comment:'Incredibly well made. The leather has aged beautifully after three months.',
      isVerified:true,
    },
  ]);
  console.log('✓ Reviews created');

  console.log('\n✅ Seed complete!\n');
  console.log('─────────────────────────────────');
  console.log('Admin login:    admin@mhdstore.com  /  Admin@1234');
  console.log('Seller login:   sophie@maisonelite.com  /  Password@1');
  console.log('Customer login: alice@example.com  /  Password@1');
  console.log('─────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
