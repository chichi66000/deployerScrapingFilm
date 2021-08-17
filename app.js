// import les modules nécessaires pour serveur
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
// const cookieParser = require('cookie-parser')
const app = express();

//import les modules pour une protection api
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
});
const expressSanitizer = require('express-sanitizer');

// load .env file pour garder secret les infos confidentiels
require('dotenv').config(); 

// setHeader
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; font-src 'self'; img-src 'self' https://m.media-amazon.com; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
})


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json


app.use(helmet());
app.use(limiter);
app.use (expressSanitizer());
app.use(cors())
// imports les routes 
const scrapingRoute = require('./routes/scrapingfilm')

app.use('/api/films', scrapingRoute)

// handle for production

  // static folder
  
  app.use(express.static(path.join(__dirname, './public')))

  // handle VueJS
  app.get('*', (req, res) => res.sendFile('./public/index.html'));

module.exports = app;