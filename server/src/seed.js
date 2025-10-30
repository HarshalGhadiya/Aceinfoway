import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './config/db.js';
import { Product, Customer, Order, Campaign, Ad } from './models/index.js';
import { logger } from './config/logger.js';

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function main() {
  await connectDB();

  await Promise.all([
    Product.deleteMany({}),
    Customer.deleteMany({}),
    Order.deleteMany({}),
    Campaign.deleteMany({}),
    Ad.deleteMany({}),
  ]);

  // Products: 20
  const categories = ['Electronics', 'Apparel', 'Home', 'Sports'];
  const products = await Product.insertMany(Array.from({ length: 20 }).map((_, i) => ({
    name: `Product ${i + 1}`,
    sku: `SKU${1000 + i}`,
    price: rand(10, 500),
    category: categories[i % categories.length],
  })));

  // Customers: 10
  const segments = ['new', 'repeat', 'vip'];
  const customers = await Customer.insertMany(Array.from({ length: 10 }).map((_, i) => ({
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    segment: segments[i % segments.length],
  })));

  // Campaigns: 5
  const now = new Date();
  const campaigns = await Campaign.insertMany(Array.from({ length: 5 }).map((_, i) => ({
    name: `Campaign ${i + 1}`,
    startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 2, 0),
    products: products.filter((_, idx) => idx % (i + 2) !== 0).map(p => p._id),
    budget: rand(1000, 5000),
  })));

  // Ads linked to campaigns with daily metrics for past 60 days
  const adDocs = [];
  for (const camp of campaigns) {
    for (let d = 0; d < 60; d++) {
      adDocs.push({
        campaign: camp._id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - d),
        clicks: rand(10, 300),
        impressions: rand(100, 10000),
        spend: rand(20, 200),
      });
    }
  }
  await Ad.insertMany(adDocs);

  // Orders: 30 with items, discounts including campaign association
  const orderDocs = [];
  for (let i = 0; i < 30; i++) {
    const itemsCount = rand(1, 4);
    const items = [];
    for (let j = 0; j < itemsCount; j++) {
      const p = products[rand(0, products.length - 1)];
      items.push({ product: p._id, quantity: rand(1, 3), priceAtPurchase: p.price });
    }

    const discounts = [];
    if (Math.random() > 0.5) discounts.push({ type: 'percentage', value: rand(5, 20) });
    if (Math.random() > 0.7) discounts.push({ type: 'fixed', value: rand(5, 30) });
    if (Math.random() > 0.4) discounts.push({ type: 'campaign', value: rand(5, 25), campaign: campaigns[rand(0, campaigns.length - 1)]._id });

    orderDocs.push({
      customer: customers[rand(0, customers.length - 1)].
      _id, // split line to keep width reasonable
      items,
      discounts,
      placedAt: new Date(now.getFullYear(), now.getMonth(), rand(1, 28)),
    });
  }

  // Use a transaction for bulk order insertion to demonstrate capability
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Order.insertMany(orderDocs, { session });
    await session.commitTransaction();
    logger.info('Seed completed');
  } catch (e) {
    await session.abortTransaction();
    logger.error(e, 'Seed failed');
  } finally {
    session.endSession();
  }

  await disconnectDB();
}

main().catch(err => { console.error(err); process.exit(1); });
