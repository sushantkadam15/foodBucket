/*
Sample Data for the Database - 2000
  */
const mongoose = require("mongoose");
const foodBuckets = require("./models/foodBuckets");

// Connecting to Database
const restaurantData = require("./public/data/restaurant-list.json"); //Import data from system
const dishes = require("./public/data/Dish.json");
const res = require("express/lib/response");

const {uri} = require('./databaseAuthentication')

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect("mongodb://localhost:27017/food-bucket", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
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

//Sample URL images for dishes
const sampleURL = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=780&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=781&q=80",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=710&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
];

const randomInt = ()=>{
  return Math.floor(Math.random() * 10);
}

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
      imgURL: sampleURL[randomInt()]
    });
    await restaurantPush
      .save()
      .then(() => console.log(`${dish.name} added to the database`));
  };
  seeding();
}
