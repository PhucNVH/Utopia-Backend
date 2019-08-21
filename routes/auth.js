//       _              _     _         ____                    _
//      / \     _   _  | |_  | |__     |  _ \    ___    _   _  | |_    ___   ___
//     / _ \   | | | | | __| | '_ \    | |_) |  / _ \  | | | | | __|  / _ \ / __|
//    / ___ \  | |_| | | |_  | | | |   |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   /_/   \_\  \__,_|  \__| |_| |_|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//

let express = require("express");
let passport = require("passport");
let ctrl = require("../controllers/user.controller");
let guard = require("../guards/guards");
let router = express.Router();
// LOGIN AND SIGNUP SITE
router.post("/test", guard.isLoggedin);
router.post(
  "/login",
  guard.isNotLoggedin,
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  ctrl.loginSuccess
);
router.post("/signup", guard.isNotLoggedin, ctrl.registerLocal);
router.post("/logout", ctrl.logout);

module.exports = router;
