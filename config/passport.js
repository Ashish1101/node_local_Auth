const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

//load user model
const User = require('../models/user');


module.exports = function(passport) {
   passport.use(new LocalStrategy({usernameField : 'email'}, (email, password , done) => {
       //match user
       User.findOne({email: email})
       .then(user => {
           //if user is not match
           if(!user) {
               done(null , false , {message : "Email is not registered with us"})
           }

           //if user match
           //then compare the password
           bcryptjs.compare(password , user.password, (err , isMatch) => {
               if(err) throw err;

               //if password match
               if(isMatch) {
                   done(null , user);
               } else {
                   done(null, false , {message  : "Incorrect password"})
               }
           })
       }).catch(err => console.log(err));
   }))

   passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}