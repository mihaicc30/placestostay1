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
const Op = Sequelize.Op;


function sanitize(param) {
  var banned_Chars = ['<', '>', '{', '}', '[', ']', '(', ')', '</script>', '<script>', 'prompt', 'alert', 'write', 'send', 'script', '?', '!', '$', '#','\`','"','\"','\'','\;','\\',`\\`];
  var textvalue = param
  for (var i = 0; i < banned_Chars.length; i++) {
    if (~textvalue.indexOf(banned_Chars[i])) {
        textvalue = String(textvalue).replace(banned_Chars[i], "");
        textvalue = sanitize(textvalue)
    }
  }
  return textvalue
}


const con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DBASE
});
const { INTEGER } = require('sequelize');

// CARD VALIDATOR // personally i would make my own but it was a requirement in the assessment brief so...here it is
var valid = require("card-validator"); // card validator api
router.get('/api/validatecard/:cardnumber/:cardname/:cardexpiration/:cardcvv', (req,res)=> { 
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
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

// Admin management - add spaces
router.post('/addspaces', ensureAuthenticated, (req, res) => {
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Acc_dates.update({"availability":req.body.number},{where:{ "accID":req.body.hotelID,"thedate":req.body.dater}})
  .then(results=>{
    if(String(results)=="0"){
      Acc_dates.create({
        "accID": req.body.hotelID,
        "thedate": req.body.dater,
        "availability": req.body.number
      })
    }
  })
})

// Profile Page
router.get('/myprofile', ensureAuthenticated, async (req, res) => {
    res.render('myprofile', {
      user: req.user,
  })
})
// myprofile_save page post
router.post('/myprofile_save', ensureAuthenticated, (req, res) => {
  // obviously in a live system i would check the old password and then update the account but this is not in the scope here
  Acc_bookings.update({"username":req.body.newUsername},{where:{ "username":req.body.oldUsername}})
  User.update({"username":req.body.newUsername, "password":hash},{where:{ "username":req.body.oldUsername}})
  .then(updatedUser => {
    res.end()
  })
  .catch(err => console.log(err));
})
// myprofile_delete page post
router.delete('/myprofile_delete', ensureAuthenticated, (req, res) => {
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  User.destroy({where:{"username":req.body.oldUsername}})
  req.logout()
  res.redirect('/')
})

router.post("/delete_point",ensureAuthenticated, async (req, res) => { // delete saved mark
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation.destroy({where:{"ID":req.body.point}})
  Accommodation_details.destroy({where:{"ID":req.body.point}})
  console.log("total deletion success")
  res.end();
});


router.post("/save_point", async (req, res) => { // save selected mark
  console.log("ajax call    time " + new Date())
  var bodyPhoto = req.body.photo
  if(bodyPhoto.length < 1) { bodyPhoto = "https://cdn-j5lfyoei.resize-files-simplefileupload.com/5zg9WtHH3SHYQ0wioSD5VqJb0CZUv4oVvEq7HBk_2FE/plain/s3://static.files-simplefileupload.com/0blkz8lio489yzeapuf2qv0de7oc"}
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
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
      "photo": bodyPhoto,
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
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation_details.findAll({where:{"ID": req.params.id },attributes: ['photo', 'ID'], order:[['main_photo','DESC']]  }).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No accommodation found by given id.😢")
    }
  })
});
router.get('/api/id/:id', (req,res)=> {     
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation.findAll({where:{"ID":{[Op.like]: `%${req.params.id}%` }  }}).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No accommodation found by given id.😢")
    }
  })
});
router.get('/api/acc/loc/:location', (req,res)=> {               // task PartA.1.        
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  if(req.params.location!=""){
    Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` }  }}).then((results)=>{
      if(results.length>0){
        res.status(200)
        res.json(results);
      } else {
        res.status(404)
        res.json(`No accommodation found by given location.😢 = ${req.params.location}`)
      }
    })
  }
});
////////// APIs For Filtering ////////////
router.get('/api/acc/name/:name', (req,res)=> {    // filter > name    
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` }  }}).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No accommodation found by given name.😢")
    }
  })
});
router.get('/api/acc/name/:name/location/:location', (req,res)=> { // filter > name, location      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }

  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` },"location":{[Op.like]: `%${req.params.location}%` }}}).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No accommodation found by given name or location.😢")
    }
  })
});
router.get('/api/acc/name/:name/type/:type', (req,res)=> {  // filter > name, type
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` }, "type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No accommodation found by given parameters.😢")
    }
  })
});
router.get('/api/acc/name/:name/location/:location/type/:type', (req,res)=> {  // filter > name, location, type
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation.findAll({where:{"name":{[Op.like]: `%${req.params.name}%` },"location":{[Op.like]: `%${req.params.location}%` }, "type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No accommodation found by given parameters.😢")
    }
  })
});
router.get('/api/acc/location/:location', (req,res)=> { // filter > location
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` } }}).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No accommodation found by given parameters.😢")
    }
  })
});
router.get('/api/acc/location/:location/type/:type', (req,res)=> {  // filter > location, type   // task PartA.2.
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  if(req.params.location!="" && req.params.type!=""){
    Accommodation.findAll({where:{"location":{[Op.like]: `%${req.params.location}%` }, 
          "type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
      if(results.length>0){
        res.status(200)
        res.json(results);
      } else {
        res.status(404)
        res.json("No accommodation found by given parameters.😢")
      }
    })
  }
});
router.get('/api/acc/type/:type', (req,res)=> {  // filter > type
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation.findAll({where:{"type":{[Op.like]: `%${req.params.type}%`}  }}).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No results found by given parameters.😢")
    }
  })
});
////////// END For Filtering ////////////
// BOOKINGS // await Acc_bookings.findAll({raw:true},{where:{"username": req.user.username} ,order:[['thedate','ASC']]} ).then((results)=>{
router.get('/api/bookings', (req,res)=> { 
  Acc_bookings.findAll().then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No results found by given parameters.😢")
    }
  })
});

// showing user his bookings API
router.get('/api/user/bookings/:username', ensureAuthenticated, async (req,res)=> { 
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  await Acc_bookings.findAll({where:{"username": req.params.username} ,order:[['thedate','DESC']]} ).then((results)=>{
    if(results.length>0){
      res.status(200)
      res.json(results);
    } else {
      res.status(404)
      res.json("No results found by given parameters.😢")
    }
  })
});

// API FOR CHECKING AVAILABLE PEOPLE IN ONE ACCOMMODATION //
router.get('/api/availability/:thisDate/:thisID', (req,res)=> { 
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Acc_dates.findAll({where:{"thedate":req.params.thisDate, "accID": req.params.thisID}} ).then((results)=>{
    if(results.length>0 && JSON.parse(JSON.stringify(results))[0]["availability"] != "0"){
      res.status(200)
      res.json(JSON.parse(JSON.stringify(results))[0].availability);
    } else {
      res.status(404)
      res.json("Fully booked on this date!")
    }
  })
});

router.post('/api/img/:img/acc/:acc', ensureAuthenticated,(req,res)=> {  // user adds more images to accommmodation through api
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation_details.create({"ID":req.params.acc, "photo":req.params.img}).then((results)=>{
      console.log("db record inserted > added photo to accommodation");
  })
});
router.post('/api/insertIMG', ensureAuthenticated,(req,res)=> {  // user adds more images to accommmodation
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  Accommodation_details.create({"ID":req.body.IDD, "photo":req.body.photoo}).then((results)=>{
    res.status(200)
    res.end()
  }) 
});


router.post('/makeMainAccImage', (req,res)=> {  // user changes main img of accommodation
      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  if(req.body.userAdmin == 1){
    Accommodation_details.findOne({where:{ "main_photo":"1", "ID":req.body.IDD}}).then((result)=>{
      if(JSON.stringify(result).length>0){
        Accommodation_details.update({"main_photo":null, "icon":null, "price":null },{where:{ "main_photo":"1", "ID":req.body.IDD}})
        Accommodation_details.update({"main_photo":1, "icon":result.dataValues.icon, "price":result.dataValues.price },{where:{ "photo":req.body.photoo, "ID":req.body.IDD}})
      }
    })
    res.end()
  } else {
    res.status(401)
    console.log("user is not admin server side");
  }
  
});

// book this
router.post('/book',  (req, res) => {

      
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
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
router.get('/book/id/:id/people/:people/date/:date', ensureAuthenticated, (req, res) => {      // task PartA.3.
  let errors = []
  
  for(elem in req.params){
    req.params[elem] = sanitize(req.params[elem])
  }
  function isInThePast(date) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)

    return date <= yesterday
  }
  
  let thisUser = JSON.parse(JSON.stringify(req.user))[0]["username"]
  if(typeof thisUser == "undefined"){
    errors.push("Need to be authenticated.")
  }
  if(req.params.id < 1){
    errors.push(`Accommodation ID cant be ${req.params.id}!`)
  }
  if(!(parseInt(req.params.people) > 0) || !(parseInt(req.params.people) <= 99)){
    errors.push(`${req.params.people} is an invalid number of people.`)
  }
  if( isInThePast(new Date(`20${String(req.params.date).substring(0,2)}-${String(req.params.date).substring(2,4)}-${String(req.params.date).substring(4,6)}`)) ){
    errors.push("Date is in the past.")
  }
  if(String(req.params.date).length > 6 || String(req.params.date).length <= 0){
    errors.push(`${req.params.date} is an invalid date length.`)
  }
  let yy = String(req.params.date).substring(0,2)
  let mm = String(req.params.date).substring(2,4)
  let dd = String(req.params.date).substring(4,6)
  if (!(yy >= 22) || !(yy <= 99) || !(mm >= 1) || !(mm <= 12) || !(dd >= 1) || !(dd <= 31  )){
    errors.push(`${req.params.date} is an invalid date.`)
  }
  if(errors.length > 0){
    res.status(404)
    res.json(errors)
    res.end();
  } else {
    Acc_dates.findOne({where:{"accID":req.params.id,"thedate":req.params.date } })
    .then(checkAvailability=>{
      if(checkAvailability == null){
        res.status(404)
        res.json(`No availability on this date.`)
        res.end();
      }
      else{
        if(JSON.parse(JSON.stringify(checkAvailability)).availability < req.params.people){
          res.status(404)
          res.json(`Only ${JSON.parse(JSON.stringify(checkAvailability)).availability} people available on this date, not ${req.params.people}, sorry.`);
          res.end();
        } else{
          Acc_bookings.create({
            "accID": req.params.id,            // hotel id
            "thedate": req.params.date,                 // date of booking
            "username": thisUser,      // user that is booking
            "npeople":  req.params.people       // number of people
          }).then((results)=>{ 
            Acc_dates.decrement({"availability": req.params.people},
                {where:{"accID":req.params.id,"thedate":req.params.date } } ).then((results2)=>{
              console.log("booking success & reduced availability")
              res.status(200)
              res.json(`Booking complete.`)
              res.end()
            })
          })
        }
      }
    })
  }
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
