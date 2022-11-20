const express = require("express");
const router = express.Router({ mergeParams: true }); //Mergeparams for Cannot read properties of null (reading 'reviews') || Express router keeps the params seperate. You have to enable it using merge param
const foodBuckets = require("../models/foodBuckets"); // Mongo DB Schema and Model
const Review = require("../models/reviews"); // Review Schema
const { AppError, errorHandlerASYNC } = require("../customErrorHandler");

const {
  reviewValidationSchema,
} = require("../models/datavalidation/reviewsJOI");

const validateReviewData = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(400, msg);
  } else {
    next();
  }
};

/*-----------------------------------------
 *********** FoodBucket Routes **************
 ----------------------------------------*/

// Delete Reviews
router.delete(
  "/:reviewId",
  errorHandlerASYNC(async (req, res) => {
    const { id, reviewId } = req.params;
    await foodBuckets.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/foodBucket/${id}`);
  })
);

// Leave reviews on dishes
router.post(
  "/",
  validateReviewData,
  errorHandlerASYNC(async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    const dish = await foodBuckets.findById(req.params.id);
    console.log(dish);
    const newReview = new Review(req.body);
    console.log(newReview);
    dish.reviews.push(newReview);
    await newReview.save();
    await dish.save();
    res.redirect(`/foodBucket/${dish._id}`);
  })
);

module.exports = router;
