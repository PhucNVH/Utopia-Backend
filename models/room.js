var mongoose = require("mongoose");
var roomSchema = new mongoose.Schema({
    Name: String,
    Zone: String,
    Type: String,
    Tag: [{
        description: "String"
    }],
    Price: Number,
    Index: Number,
    RoomLeft: Number,
    Detail: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomDetail"
    }],
    Image: [{
        url: String,
    }]
});
var room = mongoose.model("Room", roomSchema);
module.exports = room;
