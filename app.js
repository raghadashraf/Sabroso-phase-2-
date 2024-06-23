const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const usersRoute = require('./routes/usersRoute.js');
const reservationsRoute = require('./routes/reservationsRoute.js');
const menuRoute = require('./routes/menuRoute.js');
const authRoute = require('./routes/authRoute.js');
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

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define routes that render the EJS templates
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
  const aboutFilePath = path.join(__dirname, 'about.txt');
  fs.readFile(aboutFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('about', { aboutText: data });
  });
});
app.get('/editAbout', (req, res) => {
  fs.readFile('about.txt', 'utf8', (err, data) => {
      if (err) {
          return res.status(500).send('Error reading file');
      }
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Edit About</title>
          <link rel="stylesheet" href="CSS/admin.css">
        </head>
        <body>
          <div class="sidebar">
            <h2>Admin Dashboard</h2>
            <ul>
              <li><a href="viewproducts">View Products</a></li>
              <li><a href="addproducts">Add Products</a></li>
              <li><a href="addcategory">Add Category</a></li>
              <li><a href="viewReser">View Reservations</a></li>
              <li><a href="viewUsers">View Users</a></li>
              <li><a href="/editAbout">Edit About</a></li>
              <li><a href="home">SignOut</a></li>
            </ul>
          </div>
          <div class="content">
            <h2>Edit About Section</h2>
            <form method="POST" action="/editAbout">
              <textarea name="aboutContent" rows="10" cols="50">${data}</textarea><br>
              <input type="submit" value="Save Changes">
            </form>
          </div>
        </body>
        </html>
    `);
});
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
app.get('/addcategory', (req, res) => {
  res.render('addcategory');
});
app.get('/admin', (req, res) => {
  res.render('admin');
});
app.get('/myProfile', (req, res) => {
  res.render('myProfile');
});
app.get('/SignIn', (req, res) => {
  res.render('SignIn');
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

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Internal Server Error');
});

// Use the defined routes
app.use('/users', usersRoute);
app.use('/reservations', reservationsRoute);
app.use('/menu', menuRoute);
app.use('/api/auth', authRoute);

// Route to handle form submission
app.post('/editAbout', (req, res) => {
  const aboutContent = req.body.aboutContent;
  fs.writeFile('about.txt', aboutContent, 'utf8', (err) => {
      if (err) {
          return res.status(500).send('Error writing file');
      }
      res.redirect('/editAbout');
  });
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("Connection failed", error.message);
  });

// Router for reservation operations
const router = express.Router();

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('User');
    return res.status(200).json({
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete a reservation by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reservation.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.status(200).send({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.use('/reservations', router);
