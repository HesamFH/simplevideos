const mongoose = require("mongoose");
const { videoValidationSchema } = require("./security/videoValidation");

//! Defining of video model schema
const schema = mongoose.Schema({
  videoTitle: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 150,
    trim: true,
  },
  videoDescription: {
    type: String,
  },
  videoAddress: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//! This method validates video upload inputs
schema.statics.validateVideo = function (body) {
  return videoValidationSchema.validate(body, { abortEarly: false });
};

//! Indexes video title for search
schema.index({ videoTitle: "text" });

module.exports = mongoose.model("Video", schema);
