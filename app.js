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

const foodBucketRoutes = require("./routes/foodBucketRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");

const {uri} = require('./databaseAuthentication')

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


// mongoose.connect("mongodb://localhost:27017/food-bucket", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

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
app.use("/foodBucket", foodBucketRoutes); // Routes for foodBucket
app.use("/foodBucket/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => res.redirect("/foodBucket"));
app.get(
  "/foodBucket",
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
