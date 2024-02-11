const express = require('express');
const path = require('path')

const app = express();

// MIDDLEWARES
app.use(express.static('public'));

app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.resolve('temp', 'index.html'));
});


const port = 3000;
app.listen(port, () => {
  console.log(`The server has been started at port ${port}`);
});
