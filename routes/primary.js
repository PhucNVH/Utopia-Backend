
//    _   _           _            _     ____                    _                
//   | | | |   ___   | |_    ___  | |   |  _ \    ___    _   _  | |_    ___   ___ 
//   | |_| |  / _ \  | __|  / _ \ | |   | |_) |  / _ \  | | | | | __|  / _ \ / __|
//   |  _  | | (_) | | |_  |  __/ | |   |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   |_| |_|  \___/   \__|  \___| |_|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//                         
var express = require("express");
var router = express.Router();

//Homepage
router.get("**", function (req, res) {
    res.render("404.html");
});


//Error Page
router.get("/404", function (req, res) {
    res.render("404.ejs");
});
router.get("*", function (req, res) {
    res.redirect("/404");
});
module.exports = router;