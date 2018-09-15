var seminarController = {};
const Seminar = require('../model/seminar');
var SeminarBuilder = require('../Data/seminar/seminar');
//ADD NEW SEMINAR
seminarController.addSeminar = (req, res, next) => {
    let newSeminar = new SeminarBuilder(req.body.name)
    .buildAbstract(req.body.abstract)
    .buildVenue(req.body.venue)
    .setDate(req.body.date)
    .setTime(req.body.time)
    .setCapacity(req.body.capacity)
    .setDuration(req.body.duration)
    .buildSpeaker(req.body.speaker)
    .buildOrganiser(req.user._id)
    .build();

    var seminar = new Seminar(newSeminar);

    seminar.save((err, newSeminar) => {
       if(err) {
           req.flash('error', err.message);
           return res.redirect('back');
       } else {
       req.flash('succes', 'New seminar has been added');
       next()
    }
    });
}

seminarController.loadSeminar = (req, res, next) => {
    Seminar.find({}, (err, seminars) => {
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        };
        req.seminars = seminars;
        next();
    });
}

seminarController.findOneSeminar = (req, res, next) => {
    Seminar.findOne({_id : req.params.id}, (err, found) => {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        } 
        req.seminar = found;
        next();
    });
}

seminarController.updateOneSeminar = (req, res, next) => {
    let updateSeminar = new SeminarBuilder(req.body.name)
    .buildAbstract(req.body.abstract)
    .buildVenue(req.body.venue)
    .setDate(req.body.date)
    .setTime(req.body.time)
    .setCapacity(req.body.capacity)
    .setDuration(req.body.duration)
    .buildSpeaker(req.body.speaker)
    .build();

    Seminar.findByIdAndUpdate(req.params.id, updateSeminar, (err, updated) => {
        if(err) throw err;
        next();
    });
}

seminarController.deleteOneSeminar = (req, res, next) => {
    Seminar.findByIdAndRemove(req.params.id, (err) => {
        if(err) throw err;
        next();
    });
};



module.exports = seminarController;