const express = require('express')
const router = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')
const User = require('../models/User')
const Accommodation = require('../models/Accommodation')
const Acc_bookings = require('../models/Acc_bookings')
const dotenv = require('dotenv').config();



// router.get('/api/accommodation', (req,res)=> {
//     console.log("IM HERE")
//     Accommodation.findAll().then((results)=>{
//         res.json(results);
//     })

// });



module.exports = router;
