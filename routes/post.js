
//    ____                  _       ____                    _                
//   |  _ \    ___    ___  | |_    |  _ \    ___    _   _  | |_    ___   ___ 
//   | |_) |  / _ \  / __| | __|   | |_) |  / _ \  | | | | | __|  / _ \ / __|
//   |  __/  | (_) | \__ \ | |_    |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   |_|      \___/  |___/  \__|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//                                                                           

var express = require("express");
var room = require("../models/room");
var roomDetail = require("../models/roomdetail");
var ReserveInfo = require("../models/ReserveInfo");
var post = require("../models/post");
var Comment = require("../models/comment");
var router = express.Router();


//add a new post

router.get("/new", isAdmin, function (req, res) {
    res.render("new");
});

router.post("/new", isAdmin, function (req, res) {
    var newPost = { Title: req.body.name, Image: req.body.image, Body: req.body.description, Author: "PhucNVH" }
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
            //console.log(req.body);
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
            else { res.render("room.ejs", { room: roomfromDB, info: { message: "Normal" } }); }
        }
    });
});

//Book route
router.get("/book", findRoom, isLoggedin, function (req, res) {
    req.session.bookInfo = req.query;
    console.log(req.user);
    { res.render("book.ejs", { bookInfo: req.query, roomInfo: req.session.RoomInfo, userInfo: req.user }); }
}
);
router.post("/book", isLoggedin, function (req, res) {

    roomDetail.findOne({ _id: req.session.ReserveInfo._id }, function (err, foundRoom) {
        if (err) console.log(err);
        else {
            ReserveInfo.create({ DateIn: req.session.bookInfo.from, DateOut: req.session.bookInfo.to, Children: req.session.bookInfo.children, Adult: req.session.bookInfo.adult, username: req.user },
                function (err, newReserve) {
                    if (err) console.log(err);
                    else {
                        foundRoom.Reserve.push(newReserve);
                        foundRoom.save();
                    }
                });
        }
    });
});
router.get("/reserve", function (req, res) {
    res.render("reserve.ejs");
}
);
router.post("/reserve", function (req, res) {

    console.log(req.body.in);
    res.redirect("/reserve");
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
        //show a warn page, with choices for logged in user and non-loggedin user
        var user = { isLoggedin: false };
        res.render("warning.ejs", { checkLogin: user });
    }
}
function findRoom(req, res, next) {
    if (req.query.Name == null) res.redirect("/rooms");
    else {
        room.
            findOne({ Name: req.query.Name }).
            populate({ path: 'Detail' }).
            populate([{ path: 'Reserve', match: { $or: [{ DateIn: { $gt: req.query.from, $lt: req.query.to } }, { DateOut: { $gt: req.body.in, $lt: req.body.out } }] } }]).
            exec(function (err, Room) {
                if (err) console(err);
                var counter = 0;
                for (var i = 0; i < Room.Detail.length; i++) {
                    if (Room.Detail[i].Reserve.length == 0) {
                        counter++;
                        req.session.ReserveInfo = Room.Detail[i];
                        req.session.RoomInfo = Room;
                        break;
                    }
                };
                if (counter == 0) { console.log("No room left"); res.redirect("/rooms/" + req.query.Name, { info: { message: "No Room Left" } }); }
                else { return next(); }
            });
    }
}
module.exports = router;