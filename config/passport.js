const LocalStrategy = require('passport-local').Strategy;
const sequelize = require("../models/Database")
const User = require("../models/User")

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email',passwordField: 'password', }, async (email, password, done) => {
      var user = await User.findAll({where: {username: email}})
      user = JSON.parse(JSON.stringify(user))[0]
      if (user.length < 1) {
        return done(null, false, { message: 'That email is not registered' });
      } else {
        if(password == user.password){
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.ID);
  });

  passport.deserializeUser((ID, done) => {
    User.findAll({ where: { "ID": ID } }).then((user) => {
      return done(null, user);
    }).catch(error => {
      return done(error, null)
    });
  });
};
