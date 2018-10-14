const express = require('express');
var router = express.Router({ mergeParams: true });
const passport = require("passport");
const userController = require('../../controller/user');
const passportController = require("../../controller/passport");
const attendeeController = require('../../controller/attendee');

var Attendee = require("../../model/attendees");
//LOGIN
router.get('/user/login', (req, res) => {
    res.render('user/login.ejs');

});
router.post("/user/login", passportController.authenticate, (req, res, next) => {
    res.redirect('/');
});

// //REGISTER
// router.get('/user/register', (req, res) => {
//     res.render('user/register.ejs');
// });


//LOG OUT
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

//ADD USER
router.get('/user/new', userController.checkAdminRole, userController.checkAdminRole, (req, res) => {
    res.render('user/new.ejs');
});

router.post('/user', userController.checkAdminRole, userController.checkExistUserEmail, userController.createUser, userController.addUser, (req, res) => {
    req.flash('success', "New account has been created");
    return res.redirect('/user/new');

});

//SHOW ALL System Admin
router.get('/user/sysadmin', userController.checkAdminRole, userController.showAllSysdamin, (req, res) => {
    res.render('user/sysadmin-index.ejs', { sysadmin: req.sysadmin });
});

router.get('/user/organiser', userController.checkAdminRole, userController.showAllOrganiser, (req, res) => {
    res.render('user/organizer-index.ejs', { orginiser: req.orginiser });
});

//EDIT USER
router.get('/user/:id/:email/:type', userController.checkAdminRole, userController.showOneUser, async (req, res) => {
    await res.render('user/edit.ejs', { user: req.user, type: req.params.type });
})

router.put('/user/:id/:email/:type', userController.checkAdminRole, userController.updateOneUser, (req, res) => {
    req.flash('info', "Success");
    res.redirect('back');
});




//SHOW ALL ATTENDEES
router.get('/user/attendee', passportController.authenticate, attendeeController.loadAllAttendee, (req, res) => {

});


//DELETE USER


router.delete('/user/:id/:type', userController.checkAdminRole, userController.checkActiveSeminar, userController.deleteOneUser, (req, res) => {
    res.redirect(`/user/${req.params.type}`);
});

router.get('/:id/nametags', userController.GetAllNameTags ,(req, res, next) => {
   
    res.render('main/nametags.ejs', {attendees: req.attendees});
})

router.get('/:id/nametags/download', userController.printAllNametags, (req, res, next) => {
  
});


module.exports = router;
