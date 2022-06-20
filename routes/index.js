const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Points = require('../models/Points');

const dotenv = require('dotenv');
dotenv.config();
var db = process.env.mongoURI;
var admin = process.env.ADMIN_ID;

const banned_Chars = ['<', '>', '-', '{', '}', '[', ']', '(', ')', 'script', '<script>', '</script>', 'prompt', 'alert', 'write', 'send', '?', '!', '$', '#', '\`', '\"', '\'', '\;', '\\', '\/'];

// Contact page
router.get('/contact', (req, res) => //, ensureAuthenticated
  res.render('contact', {
    user: req.user
  })
);

// Contact post page
router.post('/contact', (req, res) => {
  var { name, email, message } = req.body;


  for (var i = 0; i < banned_Chars.length; i++) {
    if (email.includes(banned_Chars[i])) {
      email = email.replace(`script`, "").replace(`alert`, "").replace(`'`, "").replace(`\\`, "").replace(`\[`, "").replace(`<`, "").replace(`>`, "").replace(`-`, "").replace(`_`, "").replace(`{`, "").replace(`}`, "").replace(`[`, "").replace(`]`, "").replace(`(`, "").replace(`)`, "").replace(`prompt`, "").replace(`alert`, "").replace(`write`, "").replace(`send`, "").replace(`$`, "").replace(`!`, "").replace(`#`, "").replace(`\'`, "").replace(`\"`, "").replace(`\;`, "").replace(`\\`, "").replace(`\/`, "").replace(`<script>`, "").replace(`</script>`, "").replace(`\;`, "").replace(`\\`, "").replace(`\``, "").replace(`\'`, "").replace(`\"`, "").replace(`\;`, "").replace(`\\`, "")
    }
  }
  for (var i = 0; i < banned_Chars.length; i++) {
    if (name.includes(banned_Chars[i])) {
      name = name.replace(`script`, "").replace(`alert`, "").replace(`'`, "").replace(`\\`, "").replace(`\[`, "").replace(`<`, "").replace(`>`, "").replace(`-`, "").replace(`_`, "").replace(`{`, "").replace(`}`, "").replace(`[`, "").replace(`]`, "").replace(`(`, "").replace(`)`, "").replace(`prompt`, "").replace(`alert`, "").replace(`write`, "").replace(`send`, "").replace(`$`, "").replace(`!`, "").replace(`#`, "").replace(`\'`, "").replace(`\"`, "").replace(`\;`, "").replace(`\\`, "").replace(`\/`, "").replace(`<script>`, "").replace(`</script>`, "").replace(`\;`, "").replace(`\\`, "").replace(`\``, "").replace(`\'`, "").replace(`\"`, "").replace(`\;`, "").replace(`\\`, "")
    }
  }
  for (var i = 0; i < banned_Chars.length; i++) {
    if (message.includes(banned_Chars[i])) {
      message = message.replace(`script`, "").replace(`alert`, "").replace(`'`, "").replace(`\\`, "").replace(`\[`, "").replace(`<`, "").replace(`>`, "").replace(`-`, "").replace(`_`, "").replace(`{`, "").replace(`}`, "").replace(`[`, "").replace(`]`, "").replace(`(`, "").replace(`)`, "").replace(`prompt`, "").replace(`alert`, "").replace(`write`, "").replace(`send`, "").replace(`$`, "").replace(`!`, "").replace(`#`, "").replace(`\'`, "").replace(`\"`, "").replace(`\;`, "").replace(`\\`, "").replace(`\/`, "").replace(`<script>`, "").replace(`</script>`, "").replace(`\;`, "").replace(`\\`, "").replace(`\``, "").replace(`\'`, "").replace(`\"`, "").replace(`\;`, "").replace(`\\`, "")
    }
  }


  var queryz = new Contacts({ "name": name, "email": email, "message": message });
  queryz.save(function (err, results) {
    if (err) return handleError(err);
    res.render('contact', {
      user: req.user,
      success_msg: "Your message has been successfully sent! Thank you!"
    })
  })
})

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('index')
})

// Welcome Page
router.get('/index', (req, res) => {
  var queryz = Points.find({ belongs_to: req.user._id })
  queryz.exec(function (err, results) {
    if (err) return handleError(err);

    res.render('index', {
      user: req.user,
      points: results,
    })
  })
})

// myprofile_delete page post
router.post('/myprofile_delete', ensureAuthenticated, (req, res) => {
  var { userid } = req.body;
  User.deleteOne({ _id: userid }).exec().then(
    req.flash('success_msg', `Account successfully deleted.`),
    req.logout(),
    res.redirect('index'))
})

router.post("/delete_point", (req, res) => { // delete saved mark
  var queryz = Points.deleteOne({ _id: req.body.point })
  queryz.exec(function (err, results) {
    if (err) return res.status(400).send(err);
    console.log("deletion success")
    res.end();
  })
});


router.post("/save_point", (req, res) => { // save selected mark
  console.log("ajax call    time " + new Date())
  var type = req.body.type;

  if (type == "marker") {
    var queryz = Points({
      "type": type,
      "coords": req.body.coords,
      "icon": req.body.icon,
      "alt": req.body.alt,
      "popup_message": req.body.popup_message,
      "layer_group": "markz",
      "belongs_to": req.user._id
    })
  }
  if (type == "circle") {
    var queryz = Points({
      "type": type,
      "coords": req.body.coords,
      "icon": req.body.icon,
      "alt": req.body.alt,
      "color": req.body.color,
      "fill_color": req.body.fill_color,
      "fill_opacity": req.body.fill_opacity,
      "radius": req.body.radius,
      "popup_message": req.body.popup_message,
      "layer_group": "markz",
      "belongs_to": req.user._id
    })
  }

  console.log(type);
  queryz.save(function (err, results) {
    if (err) return res.status(400).send(err);
    console.log("save success")
    res.end();
  })
});







module.exports = router;
