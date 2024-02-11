const express = require('express');

const app = express();

app.get('/', (req, res) => {
  const photo = {
    id: 1,
    name: "Photo 1",
    src: "Photo source",
    desc: "Photo description"
  }

  res.status(200).send(photo);

});

const port = 3000;
app.listen(port, () => {
  console.log(`The server has been started at port ${port}`);
});
