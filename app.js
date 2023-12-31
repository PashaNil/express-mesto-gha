const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { errors } = require('celebrate');

const routes = require('./routes/index');

const { PORT } = require('./config');

const cors = require('./middlewares/cors');

const errorHandler = require('./middlewares/error-handler');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
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

app.use(express.json());
app.use(helmet());
app.use(cors);

// Все роуты
app.use(routes);
// Валидация celebrate
app.use(errors());
// Централизованный обработчик ошибок
app.use(errorHandler);
