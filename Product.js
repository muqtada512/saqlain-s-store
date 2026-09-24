const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['skincare', 'haircare', 'fragrance'],
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    buyLink: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
