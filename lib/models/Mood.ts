import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mood name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Mood description is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Mood image URL is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // References to products
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

// Update the updatedAt timestamp before saving
moodSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Mood = mongoose.models.Mood || mongoose.model('Mood', moodSchema);

export default Mood; 