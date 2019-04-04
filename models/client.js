var mongoose = require("mongoose");
var clientSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    Fullname: String,
    Type: String,
    Email: String,
    PhoneNum: String,
    BirthDay: Date,
});
var hotelClient = mongoose.model("Client", clientSchema);
module.exports = hotelClient;
