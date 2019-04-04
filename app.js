//    _   _           _            _     ____                    _                
//   | | | |   ___   | |_    ___  | |   |  _ \    ___    _   _  | |_    ___   ___ 
//   | |_| |  / _ \  | __|  / _ \ | |   | |_) |  / _ \  | | | | | __|  / _ \ / __|
//   |  _  | | (_) | | |_  |  __/ | |   |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   |_| |_|  \___/   \__|  \___| |_|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//                                                                                

//call package
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var client = require("./models/client");
var room = require("./models/room");
var post = require("./models/post");
mongoose.connect("mongodb+srv://PhucNVH:1@nvhp46-luffx.mongodb.net/Magneton?retryWrites=true", { useNewUrlParser: true });
//
app.use(bodyParser.urlencoded({ extended: true }));
//
app.use(express.static("public"));
//
app.set("view engine", "ejs");



//SETUP SCHEMA
var imageSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String
});
var image = mongoose.model("image", imageSchema);


//render home site
app.get("/", function(req, res) {
    res.render("index.ejs");
    //res.render("home.ejs",{homepageThumbnail: homepageThumbnail});
});
app.get("/new", function(req, res) {
    res.render("new");
});

app.post("/new", function(req, res) {
    var newImg = { name: req.body.name, url: req.body.url, description: req.body.description }
    image.create(newImg, function(err, image) {
        if (err) console.log(err);
        else res.redirect("/gallery");
    });
});

app.get("/gallery", function(req, res) {
    image.find({}, function(err, imgFromDB) {
        if (err) console.log(err);
        else {
            res.render("gallery", { gallery: imgFromDB });
        }
    });

});

app.get("/book", function(req, res) {
    res.render("book.ejs");
});
app.get("/explore", function(req, res) {
    res.render("explore.ejs");
});
app.get("/contact", function(req, res) {
    res.render("contact.ejs");
});
app.get("/gallery/:tagname", function(req, res) {

    image.findById(req.params.tagname, function(err, foundImage) {
        if (err) { console.log(err); }
        else {
            res.render("show.ejs", { image: foundImage });
        }
    });

});
app.get("/404", function(req, res) {
    res.send("Page not found");
});
app.get("*", function(req, res) {
    res.redirect("/404");
});
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("hotel now online at " + process.env.PORT + " and " + process.env.IP);
});
