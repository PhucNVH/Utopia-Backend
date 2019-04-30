var mongoose = require("mongoose");
var messageSchema = new mongoose.Schema({
    Email: String,
    Name: String,
    Body: String,
    Created: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Message", messageSchema);
