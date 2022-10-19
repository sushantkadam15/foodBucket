const { link } = require("joi");
const mongoose = require("mongoose");
const Review = require("./reviews");
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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

/* https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndDelete
Issue a MongoDB findOneAndDelete() command by a document's _id field. In other words, findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id }).
** This function triggers the following middleware.
findOneAndDelete()
*/

foodBucketSchema.post("findOneAndDelete", async function (doc) {
  //Runs whenever findByIdAndDelete for foodBucket is run
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Bucket", foodBucketSchema);
