const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
// Models
const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Accommodation_details = require('../models/Accommodation_details');
const Acc_bookings = require('../models/Acc_bookings');
const Acc_dates = require('../models/Acc_dates');

var mysql = require('mysql2');
const Sequelize = require("sequelize");
const { query } = require('express');
const Op = Sequelize.Op;

const banned_Chars = ['<', '>', '-', '{', '}', '[', ']', '(', ')', 'script', '<script>', '</script>', 'prompt', 'alert', 'write', 'send', '?', '!', '$', '#', '\`', '\"', '\'', '\;', '\\', '\/'];
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DBASE
});

// Welcome Page
router.get('/', async (req, res) => {
  var queryy = "SELECT name,type,location,latitude,longitude,icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation_details.description FROM accommodation\
  LEFT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID \
  WHERE icon IS NOT NULL\
  UNION\
  SELECT name,type,location,latitude,longitude,icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation_details.description FROM accommodation  \
  RIGHT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID\
  WHERE icon IS NOT NULL"
    con.query(queryy, function (err, result) {
      if (err) throw err;
      res.render('index', {
        user: req.user,
        points: JSON.parse(JSON.stringify(result))
      })
    });
})

// Profile Page
router.get('/myprofile', async (req, res) => {
  var queryz = await User.findAll({raw:true})
  results = queryz.map(v => Object.assign({}, v))
  
  res.render('myprofile', {
    user: req.user,
    profile: results,
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
  Accommodation.destroy({where:{"ID":req.body.point}})
  Accommodation_details.destroy({where:{"ID":req.body.point}})

  
  console.log("total deletion success")
  res.end();
  
});


router.post("/save_point", async (req, res) => { // save selected mark
  console.log("ajax call    time " + new Date())
  const createMark = await Accommodation.create({
    "name": req.body.name,
    "type": req.body.type,
    "location": req.body.location,
    "latitude": req.body.latitude,
    "longitude": req.body.longitude
  }).then(async(result) => {
    var accID = JSON.parse(JSON.stringify(result)).ID
    await Accommodation_details.create({
      "ID":accID,
      "icon": req.body.icon,
      "photo": req.body.photo,
      "description": req.body.description
    }).then(async(result) => {
      console.log("save success");
      res.end();
    })
    
  })

   
});

// ACCOMMODATIONS //
router.get('/api/acc', (req,res)=> { 

  var queryy = "SELECT name,type,location,latitude,longitude,icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation_details.description FROM accommodation\
  LEFT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID \
  WHERE icon IS NOT NULL\
  UNION\
  SELECT name,type,location,latitude,longitude,icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation_details.description FROM accommodation  \
  RIGHT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID\
  WHERE icon IS NOT NULL"
  con.query(queryy, function (err, result) {
    if (err) throw err;
    res.json(result);
  });

  // Accommodation.findAll().then((results)=>{
  //     res.json(results);
  // })
});

router.get('/api/img/:id', (req,res)=> {  // give me image links
  Accommodation_details.findAll({where:{"ID": req.params.id },attributes: ['photo', 'ID']  }).then((results)=>{
      res.json(results);
  })
});
router.get('/api/id/:id', (req,res)=> { 
  Accommodation.findAll({where:{"ID":{[Op.like]: `%${req.params.id}%` }  }}).then((results)=>{
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


// book this
router.post('/book',  (req, res) => {
  // to reCheck values and validate
  var theDate =String(req.body.thedate).replace("-","").replace("-","")
  Acc_bookings.create({
    "accID": req.body.accID,            // hotel id
    "thedate": theDate,                 // date of booking
    "username": req.body.username,      // user that is booking
    "npeople": req.body.npeople         // number of people
  }).then((results)=>{ 
    Acc_dates.increment({"availability": -req.body.npeople},{where:{"accID":results["dataValues"]["accID"],"thedate":results["dataValues"]["thedate"] } } ).then((results2)=>{
      console.log("booking success & reduced availability")
      res.end();
    })
  })
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
