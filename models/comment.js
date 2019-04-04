var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    Body: String,
    Created: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Client", commentSchema);
