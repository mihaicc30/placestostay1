
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
// Load User model
const mysql = require('mysql2');
const User = require('../models/User');
const dotenv = require('dotenv').config();


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', async (req, res) => {
  const { name, password, password2 } = req.body;
  let errors = [];
  if (!name || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('index', {
      errors,
      name,
      password,
      password2
    });
  } else {
    const user = await User.findOne({ where: { username: name } });

    if (user !== null) {
      errors.push({ msg: 'Username already exists' });
      res.render('register', {
        errors,
        name,
        password,
        password2
      });
    } else {
      const newUser = User.create({
        username: name,
        password: password
      }).then(newUser => {
        req.flash(
          'success_msg',
          'You are now registered and can log in');
        res.redirect('/');
      })
        .catch(err => console.log(err));
    }
  }
})
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  })
  (req, res, next)
  // console.log(req.session)

});

// Logout
router.get('/logout', (req, res) => {
  // console.log(req.session)
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
