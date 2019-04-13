var mongoose = require("mongoose");
var roomSchema = new mongoose.Schema({
    Floor: Number,
    Number: Number,
    IsAvailable: {
        type: Boolean,
        default: false,
    },
    DateIn: Date,
    DateOut: Date,
    Adult: Number,
    Children: {
        type: Number,
        default: 0
    }
});
var room = mongoose.model("RoomDetail", roomSchema);
module.exports = room;
