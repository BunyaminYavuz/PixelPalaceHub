const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPerPage = 2;
  const totalPhotos = await Photo.find().countDocuments();

  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', {
    photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('post', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
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
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });

    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  // let uploadedImage = req.files.image;
  // let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  photo.title = req.body.title;
  photo.description = req.body.description;
  // photo.image = '/uploads/' + uploadedImage.name;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  const deletedIamge = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedIamge);
  await Photo.findByIdAndDelete({ _id: req.params.id });
  res.redirect('/');
};
