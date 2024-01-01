if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./server/config/db');
const path = require('path');
//const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');  
const session = require('express-session'); 
const passport = require('passport');
const Mongostore = require('connect-mongo'); // to store session in MongoDB
const methodOverride = require('method-override'); // to use PUT and DELETE methods in HTML form

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('layout', 'layouts/main');    


app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());    // to support JSON-encoded bodies
app.use(express.urlencoded());  // to support URL-encoded bodies
app.use(expressLayouts);
app.use(methodOverride('_method')); // to use PUT and DELETE methods in HTML form

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: Mongostore.create({mongoUrl: process.env.MONGODB_URL}),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // equals 1 day
    }
})); // to store session in MongoDB

app.use(passport.initialize()); // to initialize passport
app.use(passport.session());   // to use passport session


connectDB(); // Connect to MongoDB

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index')); // Path: server/routes/index.js 
app.use('/',require('./server/routes/dashboard')); // Path: server/routes/dashboard.js

app.get('*', (req, res) => {
    res.status(404).render('404');
});



