const express = require('express');
var router = express.Router({mergeParams: true});
const passport = require("passport");
const userController = require('../../controller/user');
const passportController = require("../../controller/passport");
const attendeeController = require('../../controller/attendee');

var Attendee = require("../../model/attendees");
//LOGIN
router.get('/user/login', (req, res) => {
    res.render('user/login.ejs');

});
router.post("/user/login", passportController.authenticate ,(req, res, next) => {
    res.redirect('/');
});

//REGISTER
router.get('/user/register', (req, res) => {
    res.render('user/register.ejs');
});


//LOG OUT
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("back");
});

//ADD USER
router.get('/user/new', (req, res) => {
    res.render('user/new.ejs');
});



router.post('/user', userController.createUser, userController.addUser, (req, res) => {
    passport.authenticate("local")(req, res, () => {
        req.flash('success', "new account has been created");
         return res.redirect('/user/login');
    });
});

//SHOW ALL USER
router.get('/user', (req, res) => {
    res.render('user/index.ejs' , {users: []});
});

//SHOW ALL ATTENDEES
router.get('/user/attendee', attendeeController.loadAllAttendee, (req, res) => {

});




//TESTING
router.get('/test', (req, res) => {
    var newAttendee = new Attendee({
    name:"Jel",
       phone: 123456789,
       email: "nguyennnngocahnnn590@gmail.com"
    });
    
    newAttendee.save((err, user) =>{
        if(err) {
            if(err.code === 11000) { req.flash("The email has already registed")}
            var error = [err.errors.phone.message, err.errors.name.message, err.message];
      
            req.flash()
            console.log(error);
        } else{
            console.log(user);
        }
    });
});
module.exports = router;
