var mongoose = require("mongoose");
var postSchema = new mongoose.Schema({
    Title: String,
    Image: String,
    body: String,
    Created: { type: Date, default: Date.now },
});
var post = mongoose.model("Post", postSchema);
module.exports = post;
