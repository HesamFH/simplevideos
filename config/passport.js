//! This whole file handles the user logins

const passport = require("passport");
const { Strategy } = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../models/user");

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        done(null, false, { message: "ایمیل یا کلمه عبور اشتباه است" });
      }

      const isPasswordsValid = await bcrypt.compare(password, user.password);

      if (isPasswordsValid) {
        done(null, user);
      } else {
        done(null, false, { message: "ایمیل یا کلمه عبور اشتباه است" });
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
