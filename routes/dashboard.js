var express = require("express");
var room = require("../models/room");
var roomDetail = require("../models/roomdetail");
var ReserveInfo = require("../models/ReserveInfo");
var router = express.Router();

router.all("/dashboard/*", isAdmin);

router.get("/dashboard", isAdmin, function (req, res) {
    res.render("dashboard/dashboard1.ejs");
});
router.get("/dashboard/2", function (req, res) {
    res.render("dashboard/dashboard2.ejs");
});
router.get("/dashboard/widgets", function (req, res) {
    res.render("dashboard/pages/widgets.ejs");
});
router.get("/dashboard/layout/top-nav", function (req, res) {
    res.render("dashboard/pages/layout/top-nav.ejs");
});
router.get("/dashboard/layout/boxed", function (req, res) {
    res.render("dashboard/pages/layout/boxed.ejs");
});
router.get("/dashboard/layout/fixed", function (req, res) {
    res.render("dashboard/pages/layout/fixed.ejs");
});
router.get("/dashboard/layout/collapsed-sidebar", function (req, res) {
    res.render("dashboard/pages/layout/collapsed-sidebar.ejs");
});
router.get("/dashboard/charts/chartjs", function (req, res) {
    res.render("dashboard/pages/charts/chartjs.ejs");
});
router.get("/dashboard/charts/morris", function (req, res) {
    res.render("dashboard/pages/charts/morris.ejs");
});
router.get("/dashboard/charts/flot", function (req, res) {
    res.render("dashboard/pages/charts/flot.ejs");
});
router.get("/dashboard/charts/inline", function (req, res) {
    res.render("dashboard/pages/charts/inline.ejs");
});
router.get("/dashboard/UI/general", function (req, res) {
    res.render("dashboard/pages/UI/general.ejs");
});
router.get("/dashboard/UI/buttons", function (req, res) {
    res.render("dashboard/pages/UI/buttons.ejs");
});
router.get("/dashboard/UI/sliders", function (req, res) {
    res.render("dashboard/pages/UI/sliders.ejs");
});
router.get("/dashboard/UI/icons", function (req, res) {
    res.render("dashboard/pages/UI/icons.ejs");
});
router.get("/dashboard/UI/timeline", function (req, res) {
    res.render("dashboard/pages/UI/timeline.ejs");
});
router.get("/dashboard/UI/modals", function (req, res) {
    res.render("dashboard/pages/UI/modals.ejs");
});
router.get("/dashboard/forms/general", function (req, res) {
    res.render("dashboard/pages/forms/general.ejs");
});
router.get("/dashboard/forms/advanced", function (req, res) {
    res.render("dashboard/pages/forms/advanced.ejs");
});
router.get("/dashboard/forms/editors", function (req, res) {
    res.render("dashboard/pages/forms/editors.ejs");
});
router.get("/dashboard/calendar", function (req, res) {
    res.render("dashboard/pages/calendar.ejs");
});
router.get("/dashboard/tables/simple", function (req, res) {
    res.render("dashboard/pages/tables/simple.ejs");
});
router.get("/dashboard/data", function (req, res) {
    // room.find({}).populate({ path: 'Detail', match: { Reserve: { $exists: true, $ne: [] } } })
    //     .exec(function (err, allRoom) {
    //         console.log(allRoom);
    //     });
    var Data = [];
    var length = 0;
    ReserveInfo.find({}, function (err, allReserve) {
        allReserve.forEach(function (reserve) {
            var reserveData = reserve;
            roomDetail.find({ Reserve: reserve._id }, function (err, Room) {
                if (err) console.log(err);
                else {

                    reserveData.Floor = Room[0].Floor;
                    reserveData.Number = Room[0].Number;

                    room.find({ Detail: Room[0]._id }, function (err, Type) {
                        if (err) console.log(err);
                        else {

                            reserveData.RoomName = Type[0].Name;
                            reserveData.Price = Type[0].Price;
                            Data.push(reserveData);
                            length++;
                            if (allReserve.length == length) { res.render("dashboard/data.ejs", { Data: Data }); }
                        }
                    });
                }
            });



        });

    });

});
router.get("/dashboard/mailbox/mailbox", function (req, res) {
    res.render("dashboard/pages/mailbox/mailbox.ejs");
});
router.get("/dashboard/examples/invoice", function (req, res) {
    res.render("dashboard/pages/examples/invoice.ejs");
});
router.get("/dashboard/examples/profile", function (req, res) {
    res.render("dashboard/pages/examples/profile.ejs");
});
router.get("/dashboard/examples/login", function (req, res) {
    res.render("dashboard/pages/examples/login.ejs");
});
router.get("/dashboard/examples/register", function (req, res) {
    res.render("dashboard/pages/examples/register.ejs");
});
router.get("/dashboard/examples/lockscreen", function (req, res) {
    res.render("dashboard/pages/examples/lockscreen.ejs");
});
router.get("/dashboard/examples/500", function (req, res) {
    res.render("dashboard/pages/examples/lockscreen.ejs");
});
router.get("/dashboard/examples/blank", function (req, res) {
    res.render("dashboard/pages/examples/blank.ejs");
});
router.get("/dashboard/examples/pace", function (req, res) {
    res.render("dashboard/pages/examples/pace.ejs");
});
router.get("/dashboard/editor", function (req, res) {
    res.render("dashboard/editor.ejs");
});
router.get("/dashboard/examples/404", function (req, res) {
    res.render("dashboard/pages/examples/404.ejs");
});
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.username == "admin") {
        return next();
    }
    else if (req.isAuthenticated()) {
        var user = { isLoggedin: true };
        res.render("warning.ejs", { checkLogin: user });
        console.log(user);
    }
    else {
        var user = { isLoggedin: false };
        res.render("warning.ejs", { checkLogin: user });
    }
}
module.exports = router;