const express = require('express');
const app = express();
const expressLayout  = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path')
require('./config/passport')(passport)
require('dotenv').config();
//bodyParser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//express layout
app.use(expressLayout);
app.set('view engine' , 'ejs')
app.use(express.static('./public'))

//setting up session
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  }))

  //setting up passport
app.use(passport.initialize());
app.use(passport.session());

  //settion up flash
  app.use(flash());
  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  })


//setting up database
//const url = "mongodb+srv://test:test@lpudevapp-uj2xp.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(() => console.log("successfully connected to database"))
.catch(err => console.log(err))




app.use('/user' , require('./routes/user'))
app.use('/', require('./routes/index'))
app.listen(5000 , () => console.log("hello world"))