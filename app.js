const dotenv = require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('cookie-session');
const app = express();
const sequelize = require("./models/Database")
const cors = require('cors')
const corsOptions = { origin:'http://localhost:8000/', optionsSuccessStatus: 200}
var valid = require("card-validator");
 

var numberValidation = valid.number("441", {maxLength: 16});
var numberValidation2 = valid.cardholderName("dsad asd 221asd asd 21s12@:<! as")
var numberValidation3 = valid.expirationDate("7/22")
var numberValidation4 = valid.cvv("722")
 
console.log("CARD DETAILS",numberValidation.card);
console.log("CARD VALIDITY",numberValidation.isValid);
console.log("CARD POT. VALIDITY",numberValidation.isPotentiallyValid);
console.log("NAME",numberValidation2.isValid);
console.log("DATE",numberValidation3.isValid);
console.log("CVV",numberValidation4.isValid);


app.use(cors(corsOptions))

// MySQL Connection
sequelize.sync().then(result =>{
  console.log("MySQL Connected "+new Date())
}).catch(err => {
  console.log(err)
})

app.use(express.json());

//passport config
require('./config/passport')(passport);


//ejs config
app.use(expressLayouts);
app.set('view engine', 'ejs');
// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 't34tg4gh667125ik6f232d32f45yg56oNIN2uniuon2u3in2iuo6uh4j6',
    resave: true,
    saveUninitialized: true,
    maxAge: 6 * 60 * 60 * 1000 // 6 hours, a number representing the milliseconds from Date.now() for expiry
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Routes
app.use('/', require(__dirname+'/routes/index.js'));
app.use('/users', require(__dirname+'/routes/users.js'));
app.use('/config', express.static('./config'));
app.use('/img', express.static('./img'));



app.all('*', (req, res) => {
  res.render("./page_not_found.ejs")
})


process.on("SIGHUP", function () {
  console.log("Stopping NodeJS server.");
  setTimeout(function() {
    process.exit();
 }, 2000);
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`NodeJS Server running on ${PORT}`));