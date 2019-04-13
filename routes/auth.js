
//       _              _     _         ____                    _                
//      / \     _   _  | |_  | |__     |  _ \    ___    _   _  | |_    ___   ___ 
//     / _ \   | | | | | __| | '_ \    | |_) |  / _ \  | | | | | __|  / _ \ / __|
//    / ___ \  | |_| | | |_  | | | |   |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   /_/   \_\  \__,_|  \__| |_| |_|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//                                                                               

var express = require("express");
var passport = require("passport");
var user = require("../models/user");
var router = express.Router();
// LOGIN AND SIGNUP SITE 
router.get("/login", function (req, res) {
    res.render("login.ejs", { method: "login" });
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/", failureRedirect: "/login"
}), function (req, res) { });
router.get("/signup", function (req, res) {

    res.render("login.ejs", { method: "signup" });

});
router.post("/signup", function (req, res) {
    var newUser = new user({ username: req.body.username })
    user.register(newUser, req.body.password, function (err, user) {
        if (err) { console.log(err); res.render("signup"); }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/rooms");
            })
        }
    });
});
router.get("/logout", function (req, res) {
    req.logout()
    res.redirect("/");
});
//Authentication
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}
module.exports = router;