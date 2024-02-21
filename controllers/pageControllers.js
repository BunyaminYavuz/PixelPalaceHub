const Photo = require('../models/Photo');

exports.getAboutPage = (req, res) => {
  res.render('about');
};

exports.getAddPage = (req, res) => {
  res.render('add');
};

exports.getUpdatePage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('update', {
    photo,
  });
};
