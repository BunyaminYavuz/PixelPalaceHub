const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const fs = require('fs');
const Photo = require('./models/Photo');

const app = express();

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['GET', 'POST'] }));

// ROUTES
app.get(['/', '/index.html'], async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('post', {
    photo,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/photos/update/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('update', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  // let uploadedImage = req.files.image;
  // let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  photo.title = req.body.title;
  photo.description = req.body.description;
  // photo.image = '/uploads/' + uploadedImage.name;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
});

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdir(uploadDir, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        // Handle the error accordingly
        return;
      }
      console.log('Upload directory created successfully');
    });
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });

    res.redirect('/');
  });
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  const deletedIamge = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedIamge);
  await Photo.findByIdAndDelete({ _id: req.params.id });
  res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
  console.log(`The server has been started at port ${port}`);
});
