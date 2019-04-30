var mongoose = require("mongoose");
var billSchema = new mongoose.Schema({
    Reserve: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reserve"
    },
    Room: {
        type: String
    },
    Floor: {
        type: Number
    },
    Number: {
        type: Number
    },
    Price: {
        type: Number,
        default: 0
    },
    Discount: {
        type: Number,
        default: 0
    },
    Fee: {
        type: Number,
        default: 0
    },
    Others: {
        type: Number,
        default: 0
    },
    Total: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});
var bill = mongoose.model("Bill", billSchema);
module.exports = bill;
