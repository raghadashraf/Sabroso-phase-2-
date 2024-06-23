const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const usersRoute = require('./routes/usersRoute');
const reservationsRoute = require('./routes/reservationsRoute.js');
const menuRoute = require('./routes/menuRoute');
const authRoute = require('./routes/authRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/Images')));
app.use(express.static(path.join(__dirname, 'public/JS')));

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define a route that renders the EJS template
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/home', (req, res) => {
  res.render('home');
});
app.get('/home2', (req, res) => {
  res.render('home2');
});
app.get('/MainMenu', (req, res) => {
  res.render('MainMenu');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/feedback', (req, res) => {
  res.render('feedback');
});
app.get('/reservation', (req, res) => {
  res.render('reservation');
});
app.get('/mainDishes', (req, res) => {
  res.render('mainDishes');
});
app.get('/drinks', (req, res) => {
  res.render('drinks');
});
app.get('/desserts', (req, res) => {
  res.render('desserts');
});
app.get('/appetizers', (req, res) => {
  res.render('appetizers');
});
app.get('/addproducts', (req, res) => {
  res.render('addproducts');
});
app.get('/admin', (req, res) => {
  res.render('admin');
});
app.get('/myProfile', (req, res) => {
  res.render('myProfile');
});
app.get('/SignUp', (req, res) => {
  res.render('SignUp');
});
app.get('/viewcate', (req, res) => {
  res.render('viewcate');
});
app.get('/viewproducts', (req, res) => {
  res.render('viewproducts');
});
app.get('/viewReser', (req, res) => {
  res.render('viewReser');
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Internal Server Error');
});

app.use('/users', usersRoute);
app.use('/reservations', reservationsRoute);
app.use('/menu', menuRoute);
app.use('/api/auth', authRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("Connection failed", error.message);
  });
