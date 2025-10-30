import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  segment: { type: String, enum: ['new', 'repeat', 'vip'], default: 'new' },
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);
