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

// CARD VALIDATOR // personally i would make my own but it was a requirement in the assessment brief so...here it is
var valid = require("card-validator"); // card validator api
router.get('/api/validatecard/:cardnumber/:cardname/:cardexpiration/:cardcvv', (req,res)=> { 
  var numberValidation = valid.number(req.params.cardnumber);
  var cardholderNameValidation = valid.cardholderName(req.params.cardname)
  var expirationDateValidation = valid.expirationDate(req.params.cardexpiration)
  var cvvValidation = valid.cvv(req.params.cardcvv)
  // The maxElapsedYear parameter determines how many years in the future a card's expiration date should be considered valid.
  // It has a default value of 19, so cards with an expiration date 20 or more years in the future would not be considered valid. 
  if(numberValidation.isValid && cardholderNameValidation.isValid && expirationDateValidation.isValid && cvvValidation.isValid){
    res.json("card valid");
  } else {
    res.json("card not valid");
  }

});

// Welcome Page
router.get('/', async (req, res) => {
  var queryy = "SELECT name,type,location,latitude,longitude,icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation.description, accommodation_details.price FROM accommodation\
  LEFT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID \
  WHERE CHAR_LENGTH(accommodation_details.icon) >1\
  UNION\
  SELECT name,type,location,latitude,longitude,icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation.description, accommodation_details.price FROM accommodation  \
  RIGHT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID\
  WHERE CHAR_LENGTH(accommodation_details.icon) >1 ORDER BY price"
    con.query(queryy, function (err, result) {
      if (err) throw err;
      res.render('index', {
        user: req.user,
        points: JSON.parse(JSON.stringify(result))
      })
    });
})

// Profile Page
router.get('/myprofile', ensureAuthenticated, async (req, res) => {
    res.render('myprofile', {
      user: req.user,
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
    "longitude": req.body.longitude,
    "description": req.body.description
  }).then(async(result) => {
    var accID = JSON.parse(JSON.stringify(result)).ID
    await Accommodation_details.create({
      "ID":accID,
      "icon": req.body.icon,
      "photo": req.body.photo,
      "price": req.body.price,
      "main_photo": "1"
    }).then(async(result) => {
      console.log("save success");
      res.end();
    })
    
  })

   
});

// ACCOMMODATIONS //
router.get('/api/acc', (req,res)=> { 

  var queryy = "\
  SELECT name,type,location,latitude,longitude,accommodation_details.icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation.description, accommodation_details.price, accommodation_details.main_photo FROM accommodation\
  LEFT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID \
  WHERE CHAR_LENGTH(accommodation_details.icon) >1 \
  UNION\
  SELECT name,type,location,latitude,longitude,accommodation_details.icon,accommodation.ID,accommodation_details.accID, accommodation_details.photo, accommodation.description, accommodation_details.price, accommodation_details.main_photo FROM accommodation\
  RIGHT JOIN accommodation_details ON accommodation.ID = accommodation_details.ID\
  WHERE CHAR_LENGTH(accommodation_details.icon) >1  ORDER BY price"
  con.query(queryy, function (err, result) {
    if (err) throw err;
    res.json(result);
  });

  // Accommodation.findAll().then((results)=>{   // at the moment is a bit complicated to run a sequelize query in the above format and keeping to the provided database format 😢
  //     res.json(results);
  // })
});

router.get('/api/img/:id', (req,res)=> {  // give me image links
  Accommodation_details.findAll({where:{"ID": req.params.id },attributes: ['photo', 'ID'], order:[['main_photo','DESC']]  }).then((results)=>{
      res.json(results);
  })
});
router.get('/api/id/:id', (req,res)=> { 
  Accommodation.findAll({where:{"ID":{[Op.like]: `%${req.params.id}%` }  }}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/loc/:location', (req,res)=> { 
  Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` }  }}).then((results)=>{
      res.json(results);
  })
});
////////// APIs For Filtering ////////////
router.get('/api/acc/name/:name', (req,res)=> {    // filter > name
  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` }  }}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/name/:name/location/:location', (req,res)=> { // filter > name, location
  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` },"location":{[Op.like]: `%${req.params.location}%` }}}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/name/:name/type/:type', (req,res)=> {  // filter > name, type
  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` }, "type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/name/:name/location/:location/type/:type', (req,res)=> {  // filter > name, location, type
  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` },"location":{[Op.like]: `%${req.params.location}%` }, "type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/location/:location', (req,res)=> { // filter > location
  Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` } }}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/location/:location/type/:type', (req,res)=> {  // filter > location, type
  Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` }, "type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
      res.json(results);
  })
});
router.get('/api/acc/type/:type', (req,res)=> {  // filter > type
  Accommodation.findAll({where:{"type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
      res.json(results);
  })
});
////////// END For Filtering ////////////
// BOOKINGS // await Acc_bookings.findAll({raw:true},{where:{"username": req.user.username} ,order:[['thedate','ASC']]} ).then((results)=>{
router.get('/api/bookings', (req,res)=> { 
  Acc_bookings.findAll().then((results)=>{
      res.json(results);
  })
});

// showing user his bookings API
router.get('/api/user/bookings/:username', ensureAuthenticated, async (req,res)=> { 
  await Acc_bookings.findAll({where:{"username": req.params.username} ,order:[['thedate','DESC']]} ).then((results)=>{
      res.json(results);
  })
});

// API FOR CHECKING AVAILABLE PEOPLE IN ONE ACCOMMODATION //
router.get('/api/availability/:thisDate/:thisID', (req,res)=> { 
  Acc_dates.findAll({where:{"thedate":req.params.thisDate, "accID": req.params.thisID}} ).then((results)=>{
    if(results.length>0){
      res.json(JSON.parse(JSON.stringify(results))[0].availability);
    } else {
      res.json(0)
    }
  })
});

router.post('/api/img/:img/acc/:acc', (req,res)=> {  // user adds more images to accommmodation through api
  Accommodation_details.create({"ID":req.params.acc, "photo":req.params.img}).then((results)=>{
      console.log("db record inserted > added photo to accommodation");
  })
});
router.post('/api/insertIMG', (req,res)=> {  // user adds more images to accommmodation
  Accommodation_details.create({"ID":req.body.IDD, "photo":req.body.photoo}).then((results)=>{
    res.end()
  }) 
});


router.post('/makeMainAccImage', (req,res)=> {  // user changes main img of accommodation
  Accommodation_details.findOne({where:{ "main_photo":"1", "ID":req.body.IDD}}) .then((result)=>{
    Accommodation_details.update({"main_photo":null, "icon":null, "price":null },{where:{ "main_photo":"1", "ID":req.body.IDD}})
    Accommodation_details.update({"main_photo":1, "icon":result.dataValues.icon, "price":result.dataValues.price },{where:{ "photo":req.body.photoo, "ID":req.body.IDD}})
    }
  )
  res.end()
  //     console.log("db record inserted > added photo to accommodation");
  // })
});

// book this
router.post('/book',  (req, res) => {
  // to reCheck values and validate
  Acc_bookings.create({
    "accID": req.body.accID,            // hotel id
    "thedate": req.body.thedate,                 // date of booking
    "username": req.body.username,      // user that is booking
    "npeople": req.body.npeople         // number of people
  }).then((results)=>{ 
    Acc_dates.increment({"availability": -req.body.npeople},{where:{"accID":results["dataValues"]["accID"],"thedate":results["dataValues"]["thedate"] } } ).then((results2)=>{
      console.log("booking success & reduced availability")
      res.end();
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
});
// book ReST api
router.post('/book/id/:id/people/:people/date/:date',  (req, res) => {
  // to reCheck values and validate
  Acc_bookings.create({
    "accID": req.params.id,            // hotel id
    "thedate": req.params.date,                 // date of booking
    "username": "ReST API Hardcoded Booking",      // user that is booking
    "npeople":  req.params.people       // number of people
  }).then((results)=>{ 
    Acc_dates.decrement({"availability": req.params.people},{where:{"accID":req.params.id,"thedate":req.params.date } } ).then((results2)=>{
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
