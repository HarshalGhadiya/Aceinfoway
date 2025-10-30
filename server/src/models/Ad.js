import mongoose from 'mongoose';

// Ad is linked to a campaign with performance metrics
const AdSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
  date: { type: Date, required: true, index: true },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  spend: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Ad', AdSchema);
