/*
Sample Data for the Database - 2000
  */
const mongoose = require("mongoose");
const foodBuckets = require("./models/foodBuckets");

// Connecting to Database
const restaurantData = require("./public/data/restaurant-list.json"); //Import data from system
const dishes = require("./public/data/Dish.json");
const res = require("express/lib/response");
mongoose.connect("mongodb://localhost:27017/food-bucket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => console.log("Connection Open - MongoDB"));

/**
 *  The JSON file contains some empty data. newDishes contains filtered values with dish prices above $10
 */
const newDishes = dishes.filter((dish) => {
  if (dish.name && dish.highest_price > 10) {
    return true;
  }
});

for (let i = 0; i <= 2000; i++) {
  const restaurant = restaurantData[i];
  const dish = newDishes[i];
  const seeding = async () => {
    const restaurantPush = new foodBuckets({
      dish: dish.name,
      restaurant: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      postalCode: restaurant.postalCode,
      province: restaurant.province,
      country: restaurant.country,
      price: dish.highest_price,
      websites: restaurant.websites,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      category: restaurant.categories.split(","),
      imgURL: 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png'
    });
    await restaurantPush
      .save()
      .then(() => console.log(`${dish.name} added to the database`));
  };
  seeding();
}
