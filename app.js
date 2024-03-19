const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const fileUpload = require('express-fileupload');

const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');
const uuid = require('uuid');
const passport = require("passport");

//Passport Config
require('./server/config/passport')(passport);

const app = express();
const bodyparse = require('body-parser');
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(fileUpload());
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');
//Bodyparser
// app.use(express.urlencoded({extended:false}));
app.use(bodyparse.urlencoded({extended:false}));



//Express Session && Cookie session
app.use(require("express-session")({
    secret:"node js mongodb",
    resave: false,
    saveUninitialized:true,
    genid:(req) =>{
        return uuid.v4();
    }
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.loggedin = "Jai Ho";
    next();
});

var User = require("./server/models/User");

//Routes
const routes = require("./server/routes/Webroutes.js");
app.use('/', routes);

app.listen(port,()=> console.log(`Listening to port ${port}`));
