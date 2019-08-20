let passport = require("passport");
let user = require("../models/user");
exports.get = (req, res) => {
  res.json({ hello: "its me" });
};
exports.loginLocal = (req, res) => {
  res.json({ message: "aba" });
};
exports.registerLocal = (req, res) => {
  let newUser = new user({
    username: req.body.username,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName
  });
  user.register(newUser, req.body.password, function(err, user) {
    if (err) {
      res.json({ message: err });
    } else {
      console.log(req);
      passport.authenticate("local")(req, res, function() {
        // console.log(req);
        res.redirect("/rooms");
      });
    }
  });
};
