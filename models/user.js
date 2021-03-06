const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { userValidationSchema } = require("./security/userValidator");

//! Defining the user model schema
const schema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//! This method validates user register inputs
schema.statics.validateUser = function (user) {
  return userValidationSchema.validate(user, { abortEarly: false });
};

//! Hashes the user's password
schema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", schema);
