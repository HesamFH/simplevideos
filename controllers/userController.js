const user = require("../models/user");
const video = require("../models/video");
const passport = require("passport");

//! This action collects user inputs and after validating inputs, it registers user and saves
//! user's information in database
exports.registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  let errors = [];

  try {
    await user.validateUser(req.body);

    if (password !== confirmPassword) {
      throw {
        inner: [
          {
            message: "کلمه های عبور یکسان نیستند",
          },
        ],
      };
    }

    const doesUserExist =
      (await user.findOne({ email })) || (await user.findOne({ username }));

    if (doesUserExist) {
      throw {
        inner: [
          {
            message: "ایمیل یا نام کاربری تکراری است",
          },
        ],
      };
    }

    await user.create({ username, email, password });

    return res.redirect("/login");
  } catch (err) {
    err.inner.forEach((error) => {
      errors.push(error.message);
    });
    res.render("register", {
      path: "/register",
      title: "ثبت نام در وبسایت",
      errors,
    });
  }
};

//! This action validates inputs and handles users login and setting the required cookies and sessions
exports.loginUser = async (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

//! This action handles remembering the user authentication by setting the cookie expire date
exports.rememberUser = (req, res) => {
  req.session.cookie.originalMaxAge = 200 * 60 * 60 * 1000;
  res.redirect("/dashboard");
};

//! This action handles and validates inputs when a user uploads a new video
exports.uploadVideo = async (req, res) => {
  if (!req.files) {
    return res.status(400).send(["ویدیو و عکس بندانگشتی اجباری است"]);
  }

  const uploadedVideo = req.files.video;
  const thumbnail = req.files.thumbnail;

  const { title, description } = req.body;

  let errors = [];

  try {
    await video.validateVideo({
      video: uploadedVideo,
      thumbnail,
      title,
      description,
    });

    const videoName = Date.now() + uploadedVideo.name;
    const thumbName = Date.now() + thumbnail.name;

    //? Moves the video to the videos directory
    uploadedVideo.mv(
      `${__dirname}/../public/uploads/videos/${videoName}`,
      (err) => {
        console.log(err);
      }
    );

    //? Moves the thumbnail to the thumbnails directory
    thumbnail.mv(
      `${__dirname}/../public/uploads/images/${thumbName}`,
      (err) => {
        console.log(err);
      }
    );

    await video.create({
      videoTitle: title,
      videoDescription: description,
      videoAddress: `/uploads/videos/${videoName}`,
      thumbnail: `/uploads/images/${thumbName}`,
      user: req.user.id,
    });

    res.status(201).json({ message: "ویدیو با موفقیت آپلود شد" });
  } catch (err) {
    err.inner.forEach((error) => {
      errors.push(error.message);
    });
    res.status(400).json({ message: errors });
  }
};
