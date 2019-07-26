var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/config');
const cors = require('cors');
var port = process.env.PORT || 5000;

var app = express();

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

app.get('/', cors(corsOptions), function (req, res) {
  return res.send('Hello! the API is at http://localhost:' + port + '/api')
})

var routes = require('./routes');
app.use('/api', routes);

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useCreateIndex: true
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection establised succesfully');
});

connection.on('error', (err) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running' + err);
  process.exit()
});

app.listen(port);
console.log('Hurray! APP started');
