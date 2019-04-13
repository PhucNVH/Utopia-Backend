var mongoose = require("mongoose");
var postSchema = new mongoose.Schema({
    Title: String,
    Image: String,
    Body: String,
    Created: { type: Date, default: Date.now },
    Author: String,
    Comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
var post = mongoose.model("Post", postSchema);
module.exports = post;
