const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodBucketSchema = new Schema({
  dish: String,
  restaurant: String,
  address: String,
  city: String,
  postalCode: String,
  province: String,
  country: String,
  price: Number,
  websites: String,
  latitude: Number,
  longitude: Number,
  description: String,
  category: [String],
  imgURL: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }]
});

module.exports = mongoose.model("Bucket", foodBucketSchema);
