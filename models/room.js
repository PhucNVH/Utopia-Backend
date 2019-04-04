var mongoose = require("mongoose");
var roomSchema = new mongoose.Schema({
    Name: String,
    Zone: String,
    Price: Number,
    Type: String,
});
var room = mongoose.model("Room", roomSchema);
module.exports = room;
