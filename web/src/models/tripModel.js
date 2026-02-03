import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    title: String,
    sub_title: String,
    highlight: String,
    price: Number,
    duration: String,
    category: String,
    subcategory: String,
    lang: String,
    description: String,
    information: Array,
    gallery: Array,
    quickstats: Array,
    slug: String,
    url_lang: String,
    meta_title: String,
    meta_description: String,
    meta_keywords: String,
    offer: String,
    isDeals: Boolean,
    badge: String,
    wetravel: String,
    url_brochure: String,
    enableDiscount: Boolean,
    discount: Number,
    ardiscounts: Array,
  },
  {
    timestamps: true,
    collection: 'trips',
    strict: false,
  }
);

export default mongoose.models.Trip || mongoose.model('Trip', tripSchema);
