var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
    res.render("landing/homepage.ejs");
});


module.exports = router;