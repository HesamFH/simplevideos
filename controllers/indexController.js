const fs = require("fs");
const path = require("path");

const user = require("../models/user");
const video = require("../models/video");
const { convertDate } = require("../utilities/jalaliConvertor");
const { truncateString } = require("../utilities/truncate");

//! This action returns the index (main) page
exports.getIndex = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const videoPerPage = 12;

    const videos = await video
      .find()
      .skip((page - 1) * videoPerPage)
      .limit(videoPerPage);

    const numberOfVideos = await video.find().countDocuments();

    res.render("index", {
      path: "/",
      title: "صفحه اصلی",
      auth: req.isAuthenticated(),
      videos,
      convertDate,
      truncateString,
      currentPage: page,
      previousPage: page - 1,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      hasNextPage: videoPerPage * page < numberOfVideos,
      lastPage: Math.ceil(numberOfVideos / videoPerPage),
      shouldShow: numberOfVideos > videoPerPage,
    });
  } catch (err) {
    console.log(err);
    res.render("500", {
      path: "/error",
      title: "اروری پیش آمد",
      auth: req.isAuthenticated(),
    });
  }
};

//! This action handles and returns searches
exports.getSearch = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const videoPerPage = 12;

    const search = req.params.search;

    const videos = await video
      .find({
        $text: {
          $search: search,
        },
      })
      .skip((page - 1) * videoPerPage)
      .limit(videoPerPage);

    const numberOfVideos = await video
      .find({
        $text: {
          $search: search,
        },
      })
      .countDocuments();

    res.render("search", {
      path: `/search/${search}`,
      title: `نتایج جستجوی ${search}`,
      auth: req.isAuthenticated(),
      videos,
      search,
      convertDate,
      truncateString,
      currentPage: page,
      previousPage: page - 1,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      hasNextPage: videoPerPage * page < numberOfVideos,
      lastPage: Math.ceil(numberOfVideos / videoPerPage),
      shouldShow: numberOfVideos > videoPerPage,
    });
  } catch (err) {
    console.log(err);
    res.render("500", {
      path: "/error",
      title: "اروری پیش آمد",
      auth: req.isAuthenticated(),
    });
  }
};

//! This action returns the login page
exports.getLogin = (req, res) => {
  res.render("login", {
    path: "/login",
    title: "ورود به وبسایت",
    error: req.flash("error"),
  });
};

//! This action returns the register page
exports.getRegister = (req, res) => {
  res.render("register", {
    path: "/register",
    title: "ثبت نام در وبسایت",
  });
};

//! This action returns the dashboard main page
exports.getDashboard = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const videoPerPage = 12;

    const currentUser = await user.findOne({ _id: req.user.id });
    if (!currentUser) throw { message: "کاربری پیدا نشد" };

    const videos = await video
      .find({ user: req.user.id })
      .skip((page - 1) * videoPerPage)
      .limit(videoPerPage);

    const numberOfVideos = await video
      .find({ user: req.user.id })
      .countDocuments();

    res.render("dashboard", {
      path: "/dashboard",
      title: "محیط کاربری",
      user: currentUser,
      layout: "./layouts/dashboardLayout",
      videos,
      convertDate,
      currentPage: page,
      previousPage: page - 1,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      hasNextPage: videoPerPage * page < numberOfVideos,
      lastPage: Math.ceil(numberOfVideos / videoPerPage),
      shouldShow: numberOfVideos > videoPerPage,
    });
  } catch (err) {
    if (err.message == "کاربری پیدا نشد") return res.redirect("/login");
    res.render("500", {
      path: "/error",
      title: "اروری پیش آمد",
      auth: req.isAuthenticated(),
    });
  }
};

//! This action returns the video upload page
exports.getUpload = async (req, res) => {
  try {
    const currentUser = await user.findOne({ _id: req.user.id });
    if (!currentUser) throw { message: "کاربری پیدا نشد" };

    res.render("upload", {
      path: "/dashboard/upload",
      title: "محیط کاربری | آپلود ویدیو",
      user: currentUser,
      layout: "./layouts/dashboardLayout",
    });
  } catch (err) {
    if (err.message == "کاربری پیدا نشد") return res.redirect("/login");
    res.render("500", {
      path: "/error",
      title: "اروری پیش آمد",
      auth: req.isAuthenticated(),
    });
  }
};

//! This action returns watch video page
exports.getVideo = async (req, res) => {
  const videoId = req.params.id;

  try {
    const wantedVideo = await video.findOne({ _id: videoId }).populate("user");

    if (!wantedVideo) return res.redirect("/404");

    const allVideos = await video.find().limit(10);

    const videos = [...allVideos].filter((video) => video._id != videoId);

    wantedVideo.views += 1;
    await wantedVideo.save();

    return res.render("video", {
      title: "پخش ویدیو",
      path: "/video",
      video: wantedVideo,
      user: wantedVideo.user,
      videoId,
      convertDate,
      truncateString,
      videos,
      auth: req.isAuthenticated(),
    });
  } catch (err) {
    console.log(err);
    res.render("500", {
      path: "/error",
      title: "اروری پیش آمد",
      auth: req.isAuthenticated(),
    });
  }
};

//! This action returns the filestream of requested video
exports.playVideo = async (req, res) => {
  const videoId = req.params.id;

  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Requires Range header");
  }

  try {
    const wantedVideo = await video.findOne({ _id: videoId });

    if (!wantedVideo) {
      return res.redirect("/video/404");
    }

    const videoAddress = path.join(
      __dirname,
      "..",
      "public",
      wantedVideo.videoAddress
    );

    const videoSize = fs.statSync(videoAddress).size;

    const CHUNK_SIZE = 10 ** 6; //? 10 ** 6 Equals 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoAddress, {
      start,
      end,
    });
    videoStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.render("500", {
      path: "/error",
      title: "اروری پیش آمد",
      auth: req.isAuthenticated(),
    });
  }
};
