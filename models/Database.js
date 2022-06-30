const Sequelize = require("sequelize")
const dotenv = require('dotenv').config();

const sequelize = new Sequelize( {
    dialect:"mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBASE,
    logging: false // disable annoying and text filling logging information :)
})

module.exports = sequelize