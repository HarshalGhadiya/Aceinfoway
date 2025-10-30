import mongoose from 'mongoose';

// Campaign holds relation to products and ads
const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  budget: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Campaign', CampaignSchema);
