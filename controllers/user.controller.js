let passport = require("passport");
let user = require("../models/user");
exports.get = (req, res) => {
  res.json({ hello: "its me" });
};
exports.loginSuccess = (req, res) => {
  res.json({ message: "login success" });
};
exports.registerLocal = (req, res) => {
  let newUser = new user({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  user.register(newUser, req.body.password, function(err, user) {
    if (err) {
      res.json({ message: err });
    } else {
      passport.authenticate("local")(req, res, function() {
        res.json({ message: "register success" });
      });
    }
  });
};
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.json({ message: "log out success" });
};
