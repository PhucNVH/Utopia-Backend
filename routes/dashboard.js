var express = require("express");
var room = require("../models/room");
var roomDetail = require("../models/roomdetail");
var ReserveInfo = require("../models/ReserveInfo");

var billInfo = require("../models/bill");
var router = express.Router();
var user = require("../models/user");

//add middleware before access every dashboard route
router.all("/dashboard/*", isAdmin);

//Main dashboard
router.get("/dashboard", isAdmin, function(req, res) {
  res.render("dashboard/dashboard1.ejs", { currentUser: req.user });
});

//billing dashboard
router.get("/dashboard/billing", function(req, res) {
  billInfo.find({}, function(err, allBill) {
    if (err) console.log(err);
    else {
      var Data = [];
      var length = 0;
      allBill;
      allBill.forEach(function(bill) {
        var billData = bill.toObject();
        ReserveInfo.findById(bill.Reserve, function(err, reserve) {
          billData.DateIn = reserve.DateIn;
          billData.DateOut = reserve.DateOut;
          billData.DateReserve = reserve.DateReserve;
          user.findById(reserve.username, function(err, User) {
            if (err) console.log(err);
            else {
              if (User == undefined) {
                billData.Name = "";
                billData.Username = "";
              } else {
                billData.Name = User.FirstName + " " + User.LastName;
                billData.Username = User.username;
              }
              roomDetail.find({ Reserve: reserve._id }, function(err, Room) {
                billData.Floor = Room[0].Floor;
                billData.Number = Room[0].Number;
                Data.push(billData);
                length++;
                if (allBill.length == length) {
                  res.render("dashboard/billing.ejs", { Data: Data });
                }
              });
            }
          });
        });
      });
    }
  });
});
router.get("/dashboard/billing/:id", function(req, res) {
  billInfo.findById(req.params.id, function(err, billReturn) {
    if (err) console.log(err);
    else {
      var bill = billReturn.toObject();
      ReserveInfo.findById(bill.Reserve, function(err, reserve) {
        user.findById(reserve.username, function(err, User) {
          bill.DateIn = reserve.DateIn;
          bill.DateOut = reserve.DateOut;
          bill.DateReserve = reserve.DateReserve;
          bill.Username = User.username;
          bill.Name = User.FirstName + " " + User.LastName;
          res.json(bill);
        });
      });
    }
  });
});

router.get("/dashboard/chart", function(req, res) {
  res.render("dashboard/chart.ejs");
});

router.get("/dashboard/room", function(req, res) {
  res.render("dashboard/search.ejs", {
    Room: null,
    Data: null,
    From: null,
    To: null
  });
});

router.post("/dashboard/room", function(req, res) {
  if (req.body.type == null) res.redirect("/rooms");
  else {
    Data = [];
    Type = {};
    room
      .findOne({ Name: req.body.type })
      .populate({
        path: "Detail",
        populate: {
          path: "Reserve",
          match: {
            $or: [
              { DateIn: { $gt: req.body.from, $lt: req.body.to } },
              { DateOut: { $gt: req.body.from, $lt: req.body.to } }
            ]
          }
        }
      })
      .exec(function(err, Room) {
        if (err) console(err);
        var counter = 0;
        for (var i = 0; i < Room.Detail.length; i++) {
          if (Room.Detail[i].Reserve.length == 0) {
            counter++;
            Data.push(Room.Detail[i]);
            Type = Room;
          }
        }
        if (counter == 0) {
          console.log("No room left");
          res.redirect("/rooms/" + req.body.Name, {
            info: { message: "No Room Left" }
          });
        } else if (counter > 0) {
          res.render("dashboard/search.ejs", {
            Room: Data,
            Type: Type,
            From: req.body.from,
            To: req.body.to
          });
        }
      });
  }
});
router.post("/dashboard/book", function(req, res) {
  console.log(req.body);
  roomDetail.findByIdAndDelete(req.body.RoomID, function(err, foundRoom) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    } else {
      console.log(foundRoom);
      ReserveInfo.create(
        {
          DateIn: req.body.from,
          DateOut: req.body.to,
          Children: req.body.children,
          Adult: req.body.adult,
          username: req.user
        },
        function(err, newReserve) {
          if (err) {
            res.json({ success: false });
          } else {
            billInfo.create({
              Reserve: newReserve,
              Price: req.body.Price,
              Total: req.body.Price,
              Room: req.body.Name,
              Floor: req.body.Floor,
              Number: req.body.Number
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

//editor for add new explore post
router.get("/dashboard/editor", function(req, res) {
  res.render("dashboard/editor.ejs");
});
//receive post
router.post("/dashboard/new", function(req, res) {
  var newPost = {
    Title: req.body.name,
    Image: req.body.image,
    Body: req.body.description,
    Author: "PhucNVH"
  };
  post.create(newPost, function(err, image) {
    if (err) console.log(err);
    else res.redirect("/explore");
  });
});

//AdminLTE template
router.get("/dashboard/available", function(req, res) {
  res.render("dashboard/available.ejs");
});
router.get("/dashboard/mailbox/mailbox", function(req, res) {
  res.render("dashboard/pages/mailbox/mailbox.ejs");
});
router.get("/dashboard/examples/invoice", function(req, res) {
  res.render("dashboard/pages/examples/invoice.ejs");
});
router.get("/dashboard/examples/profile", function(req, res) {
  res.render("dashboard/pages/examples/profile.ejs");
});
router.get("/dashboard/examples/login", function(req, res) {
  res.render("dashboard/pages/examples/login.ejs");
});
router.get("/dashboard/examples/register", function(req, res) {
  res.render("dashboard/pages/examples/register.ejs");
});
router.get("/dashboard/examples/lockscreen", function(req, res) {
  res.render("dashboard/pages/examples/lockscreen.ejs");
});
router.get("/dashboard/examples/500", function(req, res) {
  res.render("dashboard/pages/examples/lockscreen.ejs");
});
router.get("/dashboard/examples/blank", function(req, res) {
  res.render("dashboard/pages/examples/blank.ejs");
});
router.get("/dashboard/examples/pace", function(req, res) {
  res.render("dashboard/pages/examples/pace.ejs");
});
router.get("/dashboard/examples/404", function(req, res) {
  // res.render("dashboard/pages/examples/404.ejs");
});
router.get("/dashboard/2", function(req, res) {
  res.render("dashboard/dashboard2.ejs");
});
router.get("/dashboard/widgets", function(req, res) {
  res.render("dashboard/pages/widgets.ejs");
});
router.get("/dashboard/layout/top-nav", function(req, res) {
  res.render("dashboard/pages/layout/top-nav.ejs");
});
router.get("/dashboard/layout/boxed", function(req, res) {
  res.render("dashboard/pages/layout/boxed.ejs");
});
router.get("/dashboard/layout/fixed", function(req, res) {
  res.render("dashboard/pages/layout/fixed.ejs");
});
router.get("/dashboard/layout/collapsed-sidebar", function(req, res) {
  res.render("dashboard/pages/layout/collapsed-sidebar.ejs");
});
router.get("/dashboard/charts/chartjs", function(req, res) {
  res.render("dashboard/pages/charts/chartjs.ejs");
});
router.get("/dashboard/charts/morris", function(req, res) {
  res.render("dashboard/pages/charts/morris.ejs");
});
router.get("/dashboard/charts/flot", function(req, res) {
  res.render("dashboard/pages/charts/flot.ejs");
});
router.get("/dashboard/charts/inline", function(req, res) {
  res.render("dashboard/pages/charts/inline.ejs");
});
router.get("/dashboard/UI/general", function(req, res) {
  res.render("dashboard/pages/UI/general.ejs");
});
router.get("/dashboard/UI/buttons", function(req, res) {
  res.render("dashboard/pages/UI/buttons.ejs");
});
router.get("/dashboard/UI/sliders", function(req, res) {
  res.render("dashboard/pages/UI/sliders.ejs");
});
router.get("/dashboard/UI/icons", function(req, res) {
  res.render("dashboard/pages/UI/icons.ejs");
});
router.get("/dashboard/UI/timeline", function(req, res) {
  res.render("dashboard/pages/UI/timeline.ejs");
});
router.get("/dashboard/UI/modals", function(req, res) {
  res.render("dashboard/pages/UI/modals.ejs");
});
router.get("/dashboard/forms/general", function(req, res) {
  res.render("dashboard/pages/forms/general.ejs");
});
router.get("/dashboard/forms/advanced", function(req, res) {
  res.render("dashboard/pages/forms/advanced.ejs");
});
router.get("/dashboard/forms/editors", function(req, res) {
  res.render("dashboard/pages/forms/editors.ejs");
});
router.get("/dashboard/calendar", function(req, res) {
  res.render("dashboard/pages/calendar.ejs");
});
router.get("/dashboard/tables/simple", function(req, res) {
  res.render("dashboard/pages/tables/simple.ejs");
});

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.username == "admin") {
    return next();
  } else if (req.isAuthenticated()) {
    var user = { isLoggedin: true };
    res.render("warning.ejs", { checkLogin: user });
  } else {
    var user = { isLoggedin: false };
    res.render("warning.ejs", { checkLogin: user });
  }
}

module.exports = router;
