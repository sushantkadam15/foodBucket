/*
Sample Data for the Database 
  */
const mongoose = require("mongoose");
const foodBuckets = require("./models/foodBuckets");

// Connecting to Database
const restaurantData = require("./public/data/restaurant-list.json"); //Import data from system
mongoose.connect("mongodb://localhost:27017/food-bucket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => console.log("Connection Open - MongoDB"));

const seeding = async () => {
  for (restaurant of restaurantData) {
    /**Converting Categories String to array */
    const categoriesArray = restaurant.categories.split(",");
    const {
      name,
      address,
      city,
      postalCode,
      province,
      country,
      websites,
      latitude,
      longitude,
    } = restaurant;
    const restaurantPush = new foodBuckets({
      restaurant: name,
      address: address,
      city: city,
      postalCode: postalCode,
      province: province,
      country: country,
      websites: websites,
      latitude: latitude,
      longitude: longitude,
      category: categoriesArray,
    });
    await restaurantPush
      .save()
      .then(() => console.log(`${name} added to the database`));
  }
};
