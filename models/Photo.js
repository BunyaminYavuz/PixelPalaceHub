const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Connect db
mongoose.connect('mongodb://localhost/pixel-palace-test-db');

// Create a schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

// Creating a model with a schema
const Photo = mongoose.model('Photo', PhotoSchema);

// Export to use it in other file/s
module.exports = Photo;
