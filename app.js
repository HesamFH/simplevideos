const express = require("express");
const dotenv = require("dotenv");
const ejsLayout = require("express-ejs-layouts");
const passport = require("passport");
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
const MongoStore = require("connect-mongo");
const expressFileUpload = require("express-fileupload");

const connectToDb = require("./config/database");

const app = express();

//* Envoirement Variables Config
dotenv.config({ path: "./config/config.env" });

//* Connect to database
connectToDb();

//* Sessions
app.use(
  expressSession({
    secret: "mySecret",
    saveUninitialized: false,
    resave: false,
    unset: "destroy",
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI }),
  })
);

//* Flashs
app.use(connectFlash());

//* Passport and authentication
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//* View Engine Config
app.set("view engine", "ejs");
app.use(ejsLayout);
app.set("layout", "layouts/layout");

//* static files config
app.use(express.static("public"));

//* Body Parser Config
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//* expressfileupload config
app.use(expressFileUpload());

//* Routes Config
app.use("/", require("./routes/indexRoutes"));
app.use("/users", require("./routes/userRoutes"));

//* 404 Error Handling
app.use((req, res) => {
  res.render("404", {
    path: "/error",
    title: "اروری پیش آمد",
    auth: req.isAuthenticated(),
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
