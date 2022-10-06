const express = require("express");
const app = express();
const port = 3300;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); // for Patch and Delete Methods
const foodBuckets = require("./models/foodBuckets"); // Mongo DB Schema and Model
const Review = require("./models/reviews");
const morgan = require("morgan"); //Middleware
const { AppError, errorHandlerASYNC } = require("./customErrorHandler");
const Joi = require("joi");
const {
  dishValidationSchema,
} = require("./models/datavalidation/foodBucketJOI");
const {
  reviewValidationSchema,
} = require("./models/datavalidation/reviewsJOI");
const reviews = require("./models/reviews");

mongoose.connect("mongodb://localhost:27017/food-bucket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//  Database Connection Test
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => console.log("Connection Open - MongoDB"));

app.use(morgan("tiny")); // Middleware for testing routes and logging

// Initiating Express Js
app.listen(port, () => console.log(`Listening to ${port}`));
app.use(express.urlencoded({ extended: true })); // parses the url for post request
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

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
 *********** Routes *********************** 
 ----------------------------------------*/

// Add New Dish Form Page
app.get("/home/add", (req, res) => res.render("new-dish"));
app.post(
  "/home",
  validateDishData,
  errorHandlerASYNC(async (req, res) => {
    //POST is listening to /home because the form action is set to /home in ejs file.
    const dishData = req.body;
    dishData.category = newDishData.category.split(",");
    const dish = new foodBuckets(dishData);
    await dish.save();
    res.redirect(`home/${dish._id}`);
  })
);

//Edit existing dish
app.get(
  "/home/:id/edit",
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

app.patch(
  "/home/:id",
  validateDishData,
  errorHandlerASYNC(async (req, res) => {
    const { id } = req.params;
    const dishData = req.body;
    dishData.category = dishData.category.split(","); // Converting string to array
    await foodBuckets.findByIdAndUpdate(id, dishData);
    res.redirect(`/home/${id}`);
  })
);

//Delete Dish
app.delete(
  "/home/:id",
  errorHandlerASYNC(async (req, res) => {
    const { id } = req.params;
    await foodBuckets.findByIdAndDelete(id);
    res.redirect("/home");
  })
);

// Show Dish Details
app.get(
  "/home/:id",
  errorHandlerASYNC(async (req, res) => {
    const { id } = req.params;
    const star = ["", "★", "★★", "★★★", "★★★★", "★★★★★"]
    const dish = await foodBuckets.findById(id).populate('reviews');
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

// Leave reviews on dishes
app.post(
  "/home/:id/review",
  validateReviewData,
  errorHandlerASYNC(async (req, res) => {
    const dish = await foodBuckets.findById(req.params.id);
    const newReview = new Review(req.body);
    dish.reviews.push(newReview);
    await newReview.save();
    await dish.save();
    res.redirect(`/home/${dish._id}`);
  })
);

/** Route for User Home / Index */
app.get("/", (req, res) => res.redirect("/home"));
app.get(
  "/home",
  errorHandlerASYNC(async (req, res) => {
    const dishes = await foodBuckets.find({}, null, { limit: 50 }); //Displays first 50 results
    if (!dishes) {
      throw new AppError(404, "Something went wrong. Please try again later.");
    } else {
      res.render("index", { dishes });
    }
  })
);

/** ERROR HANDLING */

app.all("*", (req, res, next) => {
  next(new AppError(404, "Page not found!"));
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong..." } = err; //{a = 1} = num  sets the default value to 1
  res.status(status).render("error", { status, message });
});
