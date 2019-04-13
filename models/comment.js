var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    Body: String,
    Author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    Created: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Comment", commentSchema);
