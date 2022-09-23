const express = require("express");
const app = express();
const port = 3300;
const mongoose = require("mongoose");
const path = require("path");
const { send } = require("process");
const methodOverride = require("method-override"); // for Patch and Delete Methods
const foodBuckets = require("./models/foodBuckets"); // Mongo DB Schema and Model
const morgan = require("morgan"); //Middleware
const AppError = require("./AppError");

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
//
app.use(methodOverride("_method"));

/*-----------------------------------------
 *********** Routes *********************** */

// Add New Dish Form Page
app.get("/home/add", (req, res) => res.render("new-dish"));
app.post("/home", async (req, res) => {
  //POST is listening to /home because the form action is set to /home in ejs file.
  const newDishData = req.body;
  newDishData.category = newDishData.category.split(",");
  const newDish = new foodBuckets(newDishData);
  await newDish.save();
  res.redirect(`home/${newDish._id}`);
});

//Edit existing dish
app.get("/home/:id/edit", async (req, res) => {
  const { id } = req.params;
  const dish = await foodBuckets.findById(id);
  res.render("update", { dish });
});

app.patch("/home/:id", async (req, res) => {
  const { id } = req.params;
  const dishData = req.body;
  dishData.category = dishData.category.split(","); // Converting string to array
  await foodBuckets.findByIdAndUpdate(id, dishData);
  res.redirect(`/home/${id}`);
});

//Delete Dish
app.delete("/home/:id", async (req, res) => {
  const { id } = req.params;
  await foodBuckets.findByIdAndDelete(id);
  res.redirect("/home");
});

// Show Dish Details
app.get("/home/:id", async (req, res, next) => {
  const { id } = req.params;
  const dish = await foodBuckets.findById(id);
  if (!dish) {
    next(
      new AppError(404, "The dish you are looking for is no longer available.")
    );
  } else {
    res.render("dishinfo", { dish });
  }
});

/** Route for User Home / Index */
app.get("/", (req, res) => res.redirect("/home"));
app.get("/home", async (req, res) => {
  const dishes = await foodBuckets.find({}, null, { limit: 50 }); //Displays first 50 results
  res.render("index", { dishes });
});

//Error Handling
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong..." } = err; //{a = 1} = num  sets the default value to 1
  res.status(status).render("error", { status, message });
});
