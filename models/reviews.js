// This is a Schema file for the reviews on the dishes.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema); //Model name HAS TO BE SINGULAR
