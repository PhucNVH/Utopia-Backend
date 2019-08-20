//       _              _     _         ____                    _
//      / \     _   _  | |_  | |__     |  _ \    ___    _   _  | |_    ___   ___
//     / _ \   | | | | | __| | '_ \    | |_) |  / _ \  | | | | | __|  / _ \ / __|
//    / ___ \  | |_| | | |_  | | | |   |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   /_/   \_\  \__,_|  \__| |_| |_|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//

var express = require("express");
var passport = require("passport");
var user = require("../models/user");
var ctrl = require("../controllers/user.controller");

var router = express.Router();
// LOGIN AND SIGNUP SITE
router.post("/test", ctrl.registerLocal);
router.post(
  "/login",
  isNotLoggedIn,
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.json({ message: "login success" });
  }
);
router.post("/signup", isNotLoggedIn, function(req, res) {
  var newUser = new user({
    username: req.body.username,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName
  });
  user.register(newUser, req.body.password, function(err, user) {
    if (err) {
      res.json({ error: err });
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/rooms");
      });
    }
  });
});
router.get("/logout", function(req, res) {
  req.logout();
  req.session.destroy();
  res.json({ message: "log out success" });
});

//Authentication
function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
module.exports = router;
