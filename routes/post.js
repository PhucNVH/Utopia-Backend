
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
var Message = require("../models/message");

var billInfo = require("../models/bill");
var post = require("../models/post");
var Comment = require("../models/comment");
var router = express.Router();


//add a new post



// View All Post
router.get("/explore", function (req, res) {
    post.find({}, function (err, PostfromDB) {
        if (err) console.log(err);
        else {
            res.render("explore.ejs", { posts: PostfromDB });
        }
    });
});
//view a specific post
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

//View All Room
router.get("/rooms", function (req, res) {
    room.find({}, function (err, roomsFromDB) {
        if (err) console.log(err);
        else {
            res.render("rooms.ejs", { rooms: roomsFromDB });
        }
    });
});
//View A specific room
router.get("/rooms/:name", function (req, res) {

    room.findOne({ Name: req.params.name }).populate("Comments").exec(function (err, roomfromDB) {
        if (err) {
            console.log(err);
        }
        else {
            if (roomfromDB == null) { res.redirect("/404"); }
            else { res.render("room.ejs", { room: roomfromDB, user: req.user, info: { message: "Normal" } }); }
        }
    });
});

//check if room is available
router.post("/rooms/:name", isLoggedin, function (req, res) {

    room.findOne({ Name: req.params.name }, function (err, roomfromDB) {
        if (err) {
            console.log(err);
        }
        else {
            var CommentAdd = {
                Body: req.body.Body,
                Author: { id: req.user._id, username: req.user.username }
            }
            Comment.create(CommentAdd, function (err, newComment) {

                roomfromDB.Comments.push(newComment);
                roomfromDB.save()
                if (roomfromDB == null) { res.redirect("/404"); }
                else { res.redirect("/rooms/" + req.params.name); }
            });


        }
    });
});
//Book route
router.get("/book", findRoom, isLoggedin, function (req, res) {
    req.session.bookInfo = req.query;
    { res.render("book.ejs", { bookInfo: req.query, roomInfo: req.session.RoomInfo, userInfo: req.user }); }
}
);
router.post("/book", isLoggedin, function (req, res) {
    roomDetail.findOne({ _id: req.session.ReserveInfo._id }, function (err, foundRoom) {
        if (err) console.log(err);
        else {
            console.log(foundRoom);
            ReserveInfo.create({ DateIn: req.session.bookInfo.from, DateOut: req.session.bookInfo.to, Children: req.session.bookInfo.children, Adult: req.session.bookInfo.adult, username: req.user },
                function (err, newReserve) {
                    if (err) console.log(err);
                    else {
                        billInfo.create({
                            Reserve: newReserve,
                            Price: req.session.RoomInfo.Price,
                            Total: req.session.RoomInfo.Price,
                            Room: req.session.RoomInfo.Name,
                            Number: req.session.RoomInfo.Number
                        });
                        foundRoom.Reserve.push(newReserve);
                        console.log(foundRoom);
                        foundRoom.save();
                    }
                });
        }
    });
});





router.get("/weddings-and-events", function (req, res) {
    res.render("service.ejs");
}
);

//customer send message
router.post("/message", function (req, res) {
    Message.create({ Name: req.body.name, Email: req.body.email, Body: req.body.body }, function (err, newMessage) {
        if (err) res.json({ Success: false });
        res.json({ Success: true });
    });
});
//view user profile
router.get("/profile", isLoggedin, function (req, res) {
    res.render("profile.ejs", { Data: req.user });
}
);


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


//check if room is avaible
function findRoom(req, res, next) {
    if (req.query.Name == null) res.redirect("/rooms");
    else {
        room.
            findOne({ Name: req.query.Name }).
            populate({ path: 'Detail', populate: { path: 'Reserve', match: { $or: [{ DateIn: { $gt: req.query.from, $lt: req.query.to } }, { DateOut: { $gt: req.query.from, $lt: req.query.to } }] } } })
            .exec(function (err, Room) {
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