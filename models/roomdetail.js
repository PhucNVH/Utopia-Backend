var mongoose = require("mongoose");
var roomDetailSchema = new mongoose.Schema({
    Floor: Number,
    Number: Number,
    Reserve: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReserveInfo"
        }
    ],
});
var RoomDetail = mongoose.model("RoomDetail", roomDetailSchema);
module.exports = RoomDetail;
