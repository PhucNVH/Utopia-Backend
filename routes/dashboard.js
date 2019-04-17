var express = require("express");
var router = express.Router();


router.get("/dashboard1", function (req, res) {
    res.render("index1.ejs");
});
router.get("/dashboard2", function (req, res) {
    res.render("index2.ejs");
});
router.get("/pages/widgets", function (req, res) {
    res.render("pages/widgets.ejs");
});
router.get("/pages/layout/top-nav", function (req, res) {
    res.render("pages/layout/top-nav.ejs");
});
router.get("/pages/layout/boxed", function (req, res) {
    res.render("pages/layout/boxed.ejs");
});
router.get("/pages/layout/fixed", function (req, res) {
    res.render("pages/layout/fixed.ejs");
});
router.get("/pages/layout/collapsed-sidebar", function (req, res) {
    res.render("pages/layout/collapsed-sidebar.ejs");
});
router.get("/pages/charts/chartjs", function (req, res) {
    res.render("pages/charts/chartjs.ejs");
});
router.get("/pages/charts/morris", function (req, res) {
    res.render("pages/charts/morris.ejs");
});
router.get("/pages/charts/flot", function (req, res) {
    res.render("pages/charts/flot.ejs");
});
router.get("/pages/charts/inline", function (req, res) {
    res.render("pages/charts/inline.ejs");
});
router.get("/pages/UI/general", function (req, res) {
    res.render("pages/UI/general.ejs");
});
router.get("/pages/UI/buttons", function (req, res) {
    res.render("pages/UI/buttons.ejs");
});
router.get("/pages/UI/sliders", function (req, res) {
    res.render("pages/UI/sliders.ejs");
});
router.get("/pages/UI/icons", function (req, res) {
    res.render("pages/UI/icons.ejs");
});
router.get("/pages/UI/timeline", function (req, res) {
    res.render("pages/UI/timeline.ejs");
});
router.get("/pages/UI/modals", function (req, res) {
    res.render("pages/UI/modals.ejs");
});
router.get("/pages/forms/general", function (req, res) {
    res.render("pages/forms/general.ejs");
});
router.get("/pages/forms/advanced", function (req, res) {
    res.render("pages/forms/advanced.ejs");
});
router.get("/pages/forms/editors", function (req, res) {
    res.render("pages/forms/editors.ejs");
});
router.get("/pages/calendar", function (req, res) {
    res.render("pages/calendar.ejs");
});
router.get("/pages/tables/simple", function (req, res) {
    res.render("pages/tables/simple.ejs");
});
router.get("/pages/tables/data", function (req, res) {
    res.render("pages/tables/data.ejs");
});
router.get("/pages/mailbox/mailbox", function (req, res) {
    res.render("pages/mailbox/mailbox.ejs");
});
router.get("/pages/examples/invoice", function (req, res) {
    res.render("pages/examples/invoice.ejs");
});
router.get("/pages/examples/profile", function (req, res) {
    res.render("pages/examples/profile.ejs");
});
router.get("/pages/examples/login", function (req, res) {
    res.render("pages/examples/login.ejs");
});
router.get("/pages/examples/register", function (req, res) {
    res.render("pages/examples/register.ejs");
});
router.get("/pages/examples/lockscreen", function (req, res) {
    res.render("pages/examples/lockscreen.ejs");
});
router.get("/pages/examples/500", function (req, res) {
    res.render("pages/examples/lockscreen.ejs");
});
router.get("/pages/examples/blank", function (req, res) {
    res.render("pages/examples/blank.ejs");
});
router.get("/pages/examples/pace", function (req, res) {
    res.render("pages/examples/pace.ejs");
});

router.get("/pages/examples/404", function (req, res) {
    res.render("pages/examples/404.ejs");
});
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.username == "admin") {
        return next();
    }
    else {
        res.render("warning.ejs");
    }
}
module.exports = router;