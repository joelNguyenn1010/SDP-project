var seminarController = {};
const Seminar = require('../model/seminar');
const User = require('../model/user');
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
    .buildOrganiser_name(req.user.name)
    .build();

    
    var seminar = new Seminar(newSeminar);

    seminar.save((err, newSeminar) => {
       if(err) {
           req.flash('error', err.message);
           return res.redirect('back');
       } else {
       next()
    }
    });
}

//LOADING ALL SEMINAR
seminarController.loadSeminar = (req, res, next) => {
    Seminar.find({}, (err, seminars) => {
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        };
        req.seminars = seminars;
        // findOrganiser(seminars);
        next();
    });
}

// var findOrganiser = (id, req, res) => {
//     User.findOne({_id: id}, (err, result)=>{
//         if(err) {
//             console.log(err);
//             req.organiser = '';
//         } else {
//             console.log(result);
//         }
//     })
// }

//SHOW ONE SEMINAR
seminarController.findOneSeminar = (req, res, next) => {
    Seminar.findOne({_id : req.params.id}, (err, found) => {
        if(err) {
            req.flash('error', err.message);
            return res.render('error/404.ejs')
        } else if(found) {
            req.seminar = found;
            return next();
        } else {
            return res.render('error/404.ejs');
        }

    });

}

seminarController.updateOneSeminar = (req, res, next) => {
    let updateSeminar = {
        name: req.body.name,
        abstract: req.body.abstract,
        venue: req.body.venue,
        date: req.body.date,
        time: req.body.time,
        capacity: req.body.capacity,
        duration: req.body.duration,
        speaker: req.body.speaker
    }
    Seminar.findByIdAndUpdate(req.params.id, updateSeminar, (err, updated) => {
        if(err) {
            req.flash('error', err.message);
            return res.render('error/404.ejs')
        };
        next();
    });
}

seminarController.deleteOneSeminar = (req, res, next) => {
    Seminar.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            req.flash('error', err.message);
            return res.render('error/404.ejs')
        };
        next();
    });
};



module.exports = seminarController;