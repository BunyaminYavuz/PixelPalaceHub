const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const photoControllers = require('./controllers/photoControllers');
const pageControllers = require('./controllers/pageControllers');

const app = express();

// Connect db
mongoose.connect('mongodb://localhost/pixel-palace-hub-db');

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['GET', 'POST'] }));

// ROUTES
app.get('/', photoControllers.getAllPhotos);
app.get('/photos/:id', photoControllers.getPhoto);
app.post('/photos', photoControllers.createPhoto);
app.put('/photos/:id', photoControllers.updatePhoto);
app.delete('/photos/:id', photoControllers.deletePhoto);

app.get('/about', pageControllers.getAboutPage);
app.get('/add', pageControllers.getAddPage);
app.get('/photos/update/:id', pageControllers.getUpdatePage);

const port = 3000;
app.listen(port, () => {
  console.log(`The server has been started at port ${port}`);
});
