const express = require('express');
const app = express(); // ✅ Declare `app` early

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');
const multer = require('multer');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

dotenv.config();

// EJS setup
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // Refers to views/layout.ejs
app.use(expressLayouts);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Routes

// Index
app.get('/vehicles', async (req, res) => {
  const vehicles = await Vehicle.find();
  res.render('vehicles/index', { vehicles });
});

// New
app.get('/vehicles/new', (req, res) => {
  res.render('vehicles/new');
});

// Create
app.post('/vehicles', upload.single('image'), async (req, res) => {
  try {
    const { name, brand, price, desc } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const vehicle = new Vehicle({ name, brand, price, desc, image: imagePath });
    await vehicle.save();
    res.redirect('/vehicles');
  } catch (err) {
    res.send(err.message);
  }
});

// Show
app.get('/vehicles/:id', async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  res.render('vehicles/show', { vehicle });
});

// Edit
app.get('/vehicles/:id/edit', async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  res.render('vehicles/edit', { vehicle });
});

// Update
app.put('/vehicles/:id', upload.single('image'), async (req, res) => {
  const { name, brand, price, desc } = req.body;
  const updateData = { name, brand, price, desc };
  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }
  await Vehicle.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/vehicles');
});

// Delete
app.delete('/vehicles/:id', async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.redirect('/vehicles');
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
