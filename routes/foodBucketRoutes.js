const express = require("express");
const router = express.Router();
const { AppError, errorHandlerASYNC } = require("../customErrorHandler");
const foodBuckets = require("../models/foodBuckets"); // Mongo DB Schema and Model
const Review = require("../models/reviews");

const {
  dishValidationSchema,
} = require("../models/datavalidation/foodBucketJOI");

// Validating data upon update and creation

const validateDishData = (req, res, next) => {
  const { error } = dishValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(400, msg);
  } else {
    next();
  }
};

/*-----------------------------------------
 *********** FoodBucket Routes *********************** 
 ----------------------------------------*/

// Add New Dish Form Page
router.get("/add", (req, res) => res.render("new-dish"));
router.post(
  "/",
  validateDishData,
  errorHandlerASYNC(async (req, res) => {
    const dishData = req.body;
    dishData.category = dishData.category.split(",");
    const dish = new foodBuckets(dishData);
    await dish.save();
    res.redirect(`/foodBucket/${dish._id}`);
  })
);

//Edit existing dish
router.get(
  "/:id/edit",
  errorHandlerASYNC(async (req, res) => {
    const { id } = req.params;
    const dish = await foodBuckets.findById(id);
    if (!dish) {
      throw new AppError(
        404,
        "The dish you are trying to update is no longer available."
      );
    } else {
      res.render("update", { dish });
    }
  })
);

router.patch(
  "/:id",
  validateDishData,
  errorHandlerASYNC(async (req, res) => {
    const { id } = req.params;
    const dishData = req.body;
    dishData.category = dishData.category.split(","); // Converting string to array
    await foodBuckets.findByIdAndUpdate(id, dishData);
    res.redirect(`/foodBucket/${id}`);
  })
);

//Delete Dish - Middleware in foodBuckets.js
router.delete(
  "/:id",
  errorHandlerASYNC(async (req, res) => {
    const { id } = req.params;
    await foodBuckets.findByIdAndDelete(id);
    res.redirect("/foodBucket");
  })
);

// Show Dish Details
router.get(
  "/:id",
  errorHandlerASYNC(async (req, res) => {
    const { id } = req.params;
    const star = ["", "★", "★★", "★★★", "★★★★", "★★★★★"];
    const dish = await foodBuckets.findById(id).populate("reviews");
    if (!dish) {
      throw new AppError(
        404,
        "The Dish you are looking for is no longer available"
      );
    } else {
      res.render("dishinfo", { dish, star });
    }
  })
);

module.exports = router;
