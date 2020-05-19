const express = require('express')
const routes = express.Router();
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const passport = require('passport')


routes.get('/login' ,  (req, res) =>{
    res.render('login')
})

routes.get('/register' ,  (req, res) =>{
    res.render('register')
})

//register user

routes.post('/register' , (req, res) => {
    let errors = [];
    const {name , email , password , password2} = req.body;
    if(!name || !email || !password || !password2) {
         errors.push({msg : "Please Enter all Feild"});
    }

    if(password != password2) {
        errors.push({msg: "Password do not match"});
    }

    if(password.length < 6) {
        errors.push({msg : "Password must be atleast 6 character long"})
    }

    if(errors.length > 0) {
          res.render('register' , {
              errors,
              name,
              email,
              password,
              password2
          })
    } else {
        User.findOne({email : email})
        .then(user => {
            if(user) {
                errors.push({msg:"Email Already Registered"})
                res.render('register' , {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser  = new User({
                    name,
                    email,
                    password,
                })

                //hash passsword
                bcryptjs.genSalt(10 , (err , salt) => {
                    if(err) throw err;
                    bcryptjs.hash(newUser.password , salt , (err , hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash('success_msg' , 'You are now registered and can login');
                            res.redirect('/user/login')
                        })
                        .catch(err => console.log(err))
                    })
                })
            }
        }).catch(err  => console.log(err))
    }
})

routes.post('/login' , (req, res , next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash : true
    })(req, res , next)
})

routes.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
  });

module.exports = routes