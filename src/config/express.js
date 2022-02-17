const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.set('trust proxy', true);

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}

app.use(express.json());

module.exports = app;
