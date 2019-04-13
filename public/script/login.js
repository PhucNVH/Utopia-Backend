console.log("Ha");
var active = 1;
$(".login-form-1").click(function () {
    if (active == 1) {
        $(".login-form-2 form").hide()
        $(".login-form-1 form").show();
        active = 0;
    }
});
$(".login-form-2").click(function () {
    if (active == 0) {
        $(".login-form-2 form").show();
        $(".login-form-1 form").hide();
        active = 1;
    }
});