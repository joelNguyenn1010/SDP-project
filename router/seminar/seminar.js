const express = require('express');
const router = express.Router();
const seminarController = require('../../controller/seminar');
const passportController = require('../../controller/passport');

const Time = require("../../model/time");

//SHOW ALL SEMINAR AVAILABLE
router.get('/seminar' , seminarController.loadSeminar ,(req, res) => {
  
    res.render('seminar/index.ejs', {seminars : req.seminars});
});

//SHOW TEMPLATE TO ADD SEMINAR
router.get('/seminar/new', passportController.isLoggin, (req, res) => {
    res.render('seminar/new.ejs');
});

//CREATE SEMINAR
router.post('/seminar', passportController.isLoggin , seminarController.addSeminar , (req, res) => {
    req.flash('success', 'New seminar has been added');
    res.redirect('/seminar');
});
//SHOW SEMINAR
router.get('/seminar/:id', seminarController.findOneSeminar, (req, res) => {
    res.render('seminar/show.ejs', {seminar : req.seminar});
});


//SHOW FORM TO EDIT PARTICULAR SEMINAR
router.get('/seminar/:id/edit', passportController.isLoggin, seminarController.findOneSeminar, (req, res) => {
    res.render('seminar/edit.ejs', {seminar : req.seminar});
});


//EDIT PARTICULAR SEMINAR
router.put('/seminar/:id', passportController.isLoggin , seminarController.updateOneSeminar, (req, res) => {
    req.flash('infor', 'success update seminar');
    res.redirect('/seminar');
});


//DELETE SEMINAR
router.delete('/seminar/:id', passportController.isLoggin , seminarController.deleteOneSeminar, (req, res) => {
    res.redirect('/seminar');
});



module.exports = router;