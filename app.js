
//    __  __                                  _                       _   _           _            _
//   |  \/  |   __ _    __ _   _ __     ___  | |_    ___    _ __     | | | |   ___   | |_    ___  | |
//   | |\/| |  / _` |  / _` | | '_ \   / _ \ | __|  / _ \  | '_ \    | |_| |  / _ \  | __|  / _ \ | |
//   | |  | | | (_| | | (_| | | | | | |  __/ | |_  | (_) | | | | |   |  _  | | (_) | | |_  |  __/ | |
//   |_|  |_|  \__,_|  \__, | |_| |_|  \___|  \__|  \___/  |_| |_|   |_| |_|  \___/   \__|  \___| |_|
//                     |___/                                                                         

//include package
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
//routes
var AuthenticationRoutes = require("./routes/auth");
var PrimaryRoutes = require("./routes/primary");
var PostRoutes = require("./routes/post");
DashboardRoutes = require("./routes/dashboard");

//mongoDB schema
var client = require("./models/client");
var room = require("./models/room");
var post = require("./models/post");
var user = require("./models/user");
var Comment = require("./models/comment");
var seedDB = require("./seedDB/seed");
var RoomDB = require("./seedDB/room");
var seedRoom = require("./seedDB/seedRoom");
var seedReserve = require("./seedDB/seedReserve");
mongoose.connect("mongodb+srv://PhucNVH:1@nvhp46-luffx.mongodb.net/Magneton?retryWrites=true", { useNewUrlParser: true });
//
//seedDB();
//RoomDB();
//seedReserve();
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//
app.use(express.static("public"));
//
app.set("view engine", "ejs");
//

app.use(require("express-session")({
    secret: "Liton nhan hieu tra so mot the thegioi",
    resave: false,
    saveUninitialized: false
}))


//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})


app.use(AuthenticationRoutes);
app.use(PostRoutes);
app.use(DashboardRoutes);
app.use(PrimaryRoutes);




app.listen(process.env.PORT || 3000 || 80, process.env.IP, function () {
    console.log("hotel now online at " + process.env.PORT + " and " + process.env.IP);
});
