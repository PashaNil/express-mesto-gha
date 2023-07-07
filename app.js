const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { errors } = require('celebrate');

const routes = require('./routes/index');

const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('База mongodb подключена');
    app.listen(PORT, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  })
  .catch((err) => {
    console.log(`Ошибка подключения mongodb: ${err}`);
  });

app.use(bodyParser.json());
app.use(helmet());

// Все роуты
app.use(routes);
// Валидация celebrate
app.use(errors());
// Централизованный обработчик ошибок
app.use(errorHandler);
