import mongoose from 'mongoose';

// Order with multiple items and discounts. Supports partial returns via negative qty lines.
const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
});

const DiscountSchema = new mongoose.Schema({
  type: { type: String, enum: ['percentage', 'fixed', 'campaign'], required: true },
  value: { type: Number, required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
});

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  items: [OrderItemSchema],
  discounts: [DiscountSchema],
  placedAt: { type: Date, required: true, index: true },
}, { timestamps: true });

// Derived revenue helper (excludes campaign spend here; ROAS uses Ad spend)
OrderSchema.methods.totalBeforeDiscounts = function() {
  return this.items.reduce((sum, it) => sum + it.quantity * it.priceAtPurchase, 0);
};

OrderSchema.methods.totalDiscounts = function() {
  const sub = this.totalBeforeDiscounts();
  let total = 0;
  for (const d of this.discounts) {
    if (d.type === 'percentage') total += (sub * d.value) / 100;
    else if (d.type === 'fixed') total += d.value;
    else if (d.type === 'campaign') total += d.value; // campaign-level promo
  }
  return Math.min(total, sub); // cap discounts to subtotal
};

OrderSchema.methods.totalAfterDiscounts = function() {
  return this.totalBeforeDiscounts() - this.totalDiscounts();
};

export default mongoose.model('Order', OrderSchema);
