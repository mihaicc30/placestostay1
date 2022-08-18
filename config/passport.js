const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const sequelize = require("../models/Database")
const User = require("../models/User")

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email',passwordField: 'password', }, async (email, password, done) => {
      var user = await User.findAll({where: {username: email}})
      if (user.length < 1) {
        return done(null, false, { message: 'That email is not registered' });
      } else {
        if(password == user[0].dataValues.password){
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }

        // bcrypt.compare(password, user[0].dataValues.password, (err, isMatch) => {
        //   if (err) throw err;
        //   if (isMatch) {
        //     return done(null, user);
        //   } else {
        //     return done(null, false, { message: 'Password incorrect' });
        //   }
        // })
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user[0].dataValues.ID);
  });

  passport.deserializeUser((id, done) => {
    User.findAll({ where: { "ID": id } }).then((user) => {
      return done(null, user);
    }).catch(error => {
      return done(error, null)
    });
  });
};
