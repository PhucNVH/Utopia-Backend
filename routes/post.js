
//    ____                  _       ____                    _                
//   |  _ \    ___    ___  | |_    |  _ \    ___    _   _  | |_    ___   ___ 
//   | |_) |  / _ \  / __| | __|   | |_) |  / _ \  | | | | | __|  / _ \ / __|
//   |  __/  | (_) | \__ \ | |_    |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   |_|      \___/  |___/  \__|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//                                                                           

var express = require("express");
var room = require("../models/room");
var post = require("../models/post");
var Comment = require("../models/comment");
var router = express.Router();


//add a new post
router.get("/new", isAdmin, function (req, res) {
    res.render("new");
});

router.post("/new", isAdmin, function (req, res) {
    var newPost = { Title: req.body.name, Image: req.body.url, Body: req.body.description, Author: "PhucNVH" }
    post.create(newPost, function (err, image) {
        if (err) console.log(err);
        else res.redirect("/explore");
    });
});


// view posts
router.get("/explore", function (req, res) {
    post.find({}, function (err, PostfromDB) {
        if (err) console.log(err);
        else {
            res.render("explore.ejs", { posts: PostfromDB });
        }
    });
});
//view specific post
router.get("/explore/:post", function (req, res) {
    post.findById(req.params.post).populate("Comments").exec(function (err, foundPost) {
        if (err) { console.log(err); }
        else {
            res.render("post.ejs", { post: foundPost });
        }
    });
});
//add comment in a post
router.post("/explore/:post", isLoggedin, function (req, res) {
    post.findById(req.params.post, function (err, foundPost) {
        if (err) { console.log(err); }
        else {
            var newComment = {
                Author: req.body.Author,
                Body: req.body.Body
            };
            console.log(req.body);
            Comment.create(newComment, function (err, comment) {
                if (err) { console.log(err); }
                else {
                    comment.Author.id = req.user._id;
                    comment.Author.username = req.user.username;
                    comment.save();
                    foundPost.Comments.push(comment);
                    foundPost.save();
                    res.redirect("/explore/" + req.params.post);
                }
            });
        }
    });
});



// Room And Service
router.get("/rooms", function (req, res) {
    room.find({}, function (err, roomsFromDB) {
        if (err) console.log(err);
        else {
            res.render("rooms.ejs", { rooms: roomsFromDB });
        }
    });
});
router.get("/rooms/:name", function (req, res) {
    room.findOne({ Name: req.params.name }, function (err, roomfromDB) {
        if (err) {
            console.log(err);
        }
        else {
            if (roomfromDB == null) { res.redirect("/404"); }
            else { res.render("room.ejs", { room: roomfromDB }); }
        }
    });
});

//Book route
router.get("/book", isLoggedin, function (req, res) {
    res.render("book.ejs");
});
router.post("/book", isLoggedin, function (req, res) {
    console.log(req.body);
});
router.get("/dashboard", isAdmin, function (req, res) {
    res.render("dashboard.ejs");
});

//check login when enter the "new" route
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.username == "admin") {
        return next();
    }
    else {
        res.render("warning.ejs");
    }
}
module.exports = router;