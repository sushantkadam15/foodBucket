const express = require('express');
const app = express();
const port = 3300;
const mongoose = require('mongoose');
const path = require('path');
const { send } = require('process');
const foodBuckets = require('./models/foodBuckets')
mongoose.connect('mongodb://localhost:27017/food-bucket',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(port, () => console.log(`Listening to ${port}`));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

// Show Dish Details 

app.get('/home/:id', async (req, res) => {
    const {id} = req.params;
    const dish = await foodBuckets.findById(id);
    res.render('dishinfo', {dish})
})

/** Route for User Home / Index */
app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', async (req, res) => {
    const dishes = await foodBuckets.find({})
    res.render('index', {dishes})
});




//  Database Connection
const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection Error:"));
db.once('open', () => console.log('Connection Open - MongoDB'));

