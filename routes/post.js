//    ____                  _       ____                    _
//   |  _ \    ___    ___  | |_    |  _ \    ___    _   _  | |_    ___   ___
//   | |_) |  / _ \  / __| | __|   | |_) |  / _ \  | | | | | __|  / _ \ / __|
//   |  __/  | (_) | \__ \ | |_    |  _ <  | (_) | | |_| | | |_  |  __/ \__ \
//   |_|      \___/  |___/  \__|   |_| \_\  \___/   \__,_|  \__|  \___| |___/
//

const express = require("express");
const room = require("../models/room");
const roomDetail = require("../models/roomdetail");
const ReserveInfo = require("../models/ReserveInfo");
const Message = require("../models/message");
const billInfo = require("../models/bill");
const post = require("../models/post");
const Comment = require("../models/comment");

const router = express.Router();

// add a new post

// view All Post
router.get("/explore", (req, res) => {
  post.find({}, (err, PostfromDB) => {
    if (err) console.log(err);
    else {
      res.json({ posts: PostfromDB });
    }
  });
});
// view a specific post
router.get("/explore/:post", (req, res) => {
  post
    .findById(req.params.post)
    .populate("Comments")
    .exec((err, foundPost) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ post: foundPost });
      }
    });
});
// add comment in a post
router.post("/explore/:post", isLoggedin, (req, res) => {
  post.findById(req.params.post, (err, foundPost) => {
    if (err) {
      console.log(err);
    } else {
      const newComment = {
        Author: req.body.Author,
        Body: req.body.Body
      };
      // console.log(req.body);
      Comment.create(newComment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          newComment = comment;
          comment.Author.id = req.user._id;
          comment.Author.username = req.user.username;
          comment.save();
          foundPost.Comments.push(comment);
          foundPost.save();
          res.redirect("/explore/".concat(req.params.post));
        }
      });
    }
  });
});

// view All Room
router.get("/rooms", (req, res) => {
  room.find({}, (err, roomsFromDB) => {
    if (err) console.log(err);
    else {
      res.json({ rooms: roomsFromDB });
    }
  });
});

// view A specific room
router.get("/rooms/:name", (req, res) => {
  room
    .findOne({ Name: req.params.name })
    .populate("Comments")
    .exec((err, roomfromDB) => {
      if (err) {
        console.log(err);
      } else {
        if (roomfromDB == null) {
          res.redirect("/404");
        } else {
          res.json({
            room: roomfromDB,
            user: req.user,
            info: { message: "Normal" }
          });
        }
      }
    });
});

//check if room is available
router.post("/rooms/:name", isLoggedin, function(req, res) {
  room.findOne({ Name: req.params.name }, function(err, roomfromDB) {
    if (err) {
      console.log(err);
    } else {
      var CommentAdd = {
        Body: req.body.Body,
        Author: { id: req.user._id, username: req.user.username }
      };
      Comment.create(CommentAdd, function(err, newComment) {
        roomfromDB.Comments.push(newComment);
        roomfromDB.save();
        if (roomfromDB == null) {
          res.redirect("/404");
        } else {
          res.redirect("/rooms/" + req.params.name);
        }
      });
    }
  });
});
//Book route
router.get("/book", findRoom, isLoggedin, function(req, res) {
  req.session.bookInfo = req.query;
  {
    res.json({
      bookInfo: req.query,
      roomInfo: req.session.RoomInfo,
      userInfo: req.user
    });
  }
});
router.post("/book", isLoggedin, function(req, res) {
  roomDetail.findOne({ _id: req.session.ReserveInfo._id }, function(
    err,
    foundRoom
  ) {
    if (err) console.log(err);
    else {
      console.log(foundRoom);
      ReserveInfo.create(
        {
          DateIn: req.session.bookInfo.from,
          DateOut: req.session.bookInfo.to,
          Children: req.session.bookInfo.children,
          Adult: req.session.bookInfo.adult,
          username: req.user
        },
        function(err, newReserve) {
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
        }
      );
    }
  });
});

//customer send message
router.post("/message", function(req, res) {
  Message.create(
    { Name: req.body.name, Email: req.body.email, Body: req.body.body },
    function(err, newMessage) {
      if (err) res.json({ Success: false });
      res.json({ Success: true });
    }
  );
});
//view user profile
router.get("/profile", isLoggedin, function(req, res) {
  res.json({ Data: req.user });
});

//check login when enter the 'new' route
function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.username == "admin") {
    return next();
  } else {
    //show a warn page, with choices for logged in user and non-loggedin user
    var user = { isLoggedin: false };
    res.render("warning.ejs", { checkLogin: user });
  }
}

//check if room is avaible
function findRoom(req, res, next) {
  if (req.query.Name == null) res.redirect("/rooms");
  else {
    room
      .findOne({ Name: req.query.Name })
      .populate({
        path: "Detail",
        populate: {
          path: "Reserve",
          match: {
            $or: [
              { DateIn: { $gt: req.query.from, $lt: req.query.to } },
              { DateOut: { $gt: req.query.from, $lt: req.query.to } }
            ]
          }
        }
      })
      .exec(function(err, Room) {
        if (err) console.error(err);
        var counter = 0;
        for (var i = 0; i < Room.Detail.length; i++) {
          if (Room.Detail[i].Reserve.length == 0) {
            counter++;
            req.session.ReserveInfo = Room.Detail[i];
            req.session.RoomInfo = Room;
            break;
          }
        }
        if (counter == 0) {
          console.log("No room left");
          res.redirect("/rooms/" + req.query.Name, {
            info: { message: "No Room Left" }
          });
        } else {
          return next();
        }
      });
  }
}

function mef() {
  //this is cmgt
}
module.exports = router;
