var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: String,
  FirstName: String,
  LastName: String,
  ID: String,
  DayOfBirth: Date,
  Avatar: {
    type: String,
    default: "/asset/avatar.png"
  }
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
