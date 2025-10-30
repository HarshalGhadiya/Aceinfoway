import mongoose from 'mongoose';

// Product can belong to many campaigns via Campaign.products
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  category: { type: String, index: true },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
