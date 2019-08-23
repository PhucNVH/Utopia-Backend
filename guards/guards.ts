exports.isNotLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
};
exports.isLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(next);
    res.json({ message: "OK" });
  } else {
    res.redirect("/");
  }
};
exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
};
