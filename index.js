//    __  __                                  _                       _   _           _            _
//   |  \/  |   __ _    __ _   _ __     ___  | |_    ___    _ __     | | | |   ___   | |_    ___  | |
//   | |\/| |  / _` |  / _` | | '_ \   / _ \ | __|  / _ \  | '_ \    | |_| |  / _ \  | __|  / _ \ | |
//   | |  | | | (_| | | (_| | | | | | |  __/ | |_  | (_) | | | | |   |  _  | | (_) | | |_  |  __/ | |
//   |_|  |_|  \__,_|  \__, | |_| |_|  \___|  \__|  \___/  |_| |_|   |_| |_|  \___/   \__|  \___| |_|
//                     |___/

//include package
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
//routes
const AuthenticationRoutes = require("./routes/auth");
const PrimaryRoutes = require("./routes/primary");
const PostRoutes = require("./routes/post");

//mongoDB schema
const bill = require("./models/bill");
const room = require("./models/room");
const post = require("./models/post");
const user = require("./models/user");
const comment = require("./models/comment");
const seedDB = require("./seedDB/seed");
const roomDB = require("./seedDB/room");
const seedRoom = require("./seedDB/seedRoom");
const seedReserve = require("./seedDB/seedReserve");
mongoose.connect(
  "mongodb+srv://PhucNVH:1@nvhp46-luffx.mongodb.net/Magneton?retryWrites=true",
  { useNewUrlParser: true }
);
//seedRoom();
//seedDB();
//roomDB();
//seedReserve();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//
app.use(express.static(__dirname + "/public"));
//
app.use(
  require("express-session")({
    secret: "Liton nhan hieu tra so mot the thegioi",
    resave: false,
    saveUninitialized: false
  })
);

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(AuthenticationRoutes);
app.use(PostRoutes);
app.use(PrimaryRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log(
    "hotel now online at " +
      (process.env.PORT || 3000) +
      " and " +
      process.env.IP
  );
});
