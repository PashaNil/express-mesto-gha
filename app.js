const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('База mongodb подключена');
    app.listen(PORT, (err) => {
      err ? console.log(err) : console.log(`Сервер запущен на ${PORT} порту`);
    });
  })
  .catch((err) => {
    console.log(`Ошибка подключения mongodb: ${err}`)
  })

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649b85e2101acf599f67594f'
  };

  next();
});

app.use(routes);
