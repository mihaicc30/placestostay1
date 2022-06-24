const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Acc_bookings = require('../models/Acc_bookings');
const Acc_dates = require('../models/Acc_dates');
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const dotenv = require('dotenv').config();

const banned_Chars = ['<', '>', '-', '{', '}', '[', ']', '(', ')', 'script', '<script>', '</script>', 'prompt', 'alert', 'write', 'send', '?', '!', '$', '#', '\`', '\"', '\'', '\;', '\\', '\/'];



// book this
router.post('/book_this',  (req, res) => {
  Acc_bookings.create({
    "accID": req.body.accID,
    "thedate": String(req.body.thedate).replace("-","").replace("-",""),
    "username": req.body.username,
    "npeople": req.body.npeople
  })
  console.log("booking success")
  res.end();
});

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
router.get('/', (req, res) => {
  res.render('index')
})

// Welcome Page
router.get('/index',ensureAuthenticated, async (req, res) => {
  var queryz = await Accommodation.findAll({raw:true})
  results = queryz.map(v => Object.assign({}, v))
  
  res.render('index', {
    user: req.user,
    points: results,
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

router.post("/delete_point", async (req, res) => { // delete saved mark
  var queryz = await Accommodation.destroy({where:{"ID":req.body.point}}).then((result) => {
    console.log("deletion success")
    res.end();
  }).catch((error) =>{
    res.status(400).send(error)
  })
});


router.post("/save_point", async (req, res) => { // save selected mark
  console.log("ajax call    time " + new Date())
  const createMark = await Accommodation.create({
    "name": req.body.name,
    "type": req.body.type,
    "location": req.body.location,
    "latitude": req.body.latitude,
    "longitude": req.body.longitude,
    "icon": req.body.icon,
    "photo": req.body.photo,
    "description": req.body.description
  }).then((result) => {
    console.log("save success")
    res.end();
  }).catch((error) =>{
    res.status(400).send(error)
  })

   
});


// ACCOMMODATIONS //
router.get('/api/acc', (req,res)=> { 
  Accommodation.findAll().then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/:location', (req,res)=> { 
  Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` }  }}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/:location/:type', (req,res)=> { 
  Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` }, "type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
      res.json(results);
  })
});
// BOOKINGS //
router.get('/api/bookings', (req,res)=> { 
  Acc_bookings.findAll().then((results)=>{
      res.json(results);
  })
});

router.post('/api/bookings/:acc_id/:npeople/:date', (req,res)=> { 
  Acc_bookings.findAll()
  
    // .then((results)=>{
    //   res.json(results);
  // })
});
// USERS //
router.get('/api/users', (req,res)=> {  
  User.findAll().then((results)=>{
      res.json(results);
  })
});
// BOOKING DATES //
router.get('/api/dates', (req,res)=> {  // mysql table > acc_dates
  Acc_dates.findAll().then((results)=>{
      res.json(results);
  })
});




module.exports = router;
