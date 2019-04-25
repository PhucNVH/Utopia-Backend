var mongoose = require("mongoose");
var reserveSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    PriceIndex: Number,
    DateReserve: {
        type: Date,
        default: Date.now
    },
    DateIn: Date,
    DateOut: Date,
    Adult: Number,
    Children: {
        type: Number,
        default: 0
    }
});
var ReserveInfo = mongoose.model("ReserveInfo", reserveSchema);
module.exports = ReserveInfo;
