const express = require('express');
const app = express();
const port = 3300;
const mongoose = require('mongoose');
const path = require('path');
const foodBuckets = require('./models/foodBuckets')
mongoose.connect('mongodb://localhost:27017/food-bucket',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(port, () => console.log(`Listening to ${port}`));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', (req, res) => res.render('index'));


//  Database Connection
const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection Error:"));
db.once('open', () => console.log('Connection Open - MongoDB'));

//Seeding initial Data
app.get('/bucket', async (req, res) =>{
    const bucket = new foodBuckets({name: 'Perogies'});
    await bucket.save();
    res.send('Data Saved');
})
