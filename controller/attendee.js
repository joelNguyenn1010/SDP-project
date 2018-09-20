const AttendeeBuilder = require('../Data/attendee/attendee');
const Attendee = require('../model/attendees');
const Seminar = require('../model/seminar');
var attendeeController = {};
//REGISTER SEMINAR
attendeeController.registerSeminar = (req, res, next) => {
    // updateOrAddAttendee(req, res, next)
    var newA = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    }
    updateRefSeminar(req.body.seminarId, newA)
    res.redirect('/seminar');
}

//CHECK CAPACITY
attendeeController.checksAvailability = (req, res, next) => {
    Seminar.findById({_id: req.body.seminarId}, (err, found) => {
        if(err) throw err;
        if(found.attendees.length < found.capacity && req.body.email.length > 0 && req.body.name.length > 0 && req.body.phone.length > 0) {
            return next();
        } else {
            return res.render('attendee/outOfSpace.ejs');
        }
    });
};


//CHECK EXISTING EMAIL IN ATTENDEE
attendeeController.checkExistingAttendee = (req, res, next) => {
    var seminarId = null;
    if(req.body.seminarId) {
        seminarId = req.body.seminarId;
    } else {
        seminarId = req.params.id;
    }
    Seminar.findById({_id: seminarId}, (err, found) => {
        if(err) {console.log(err);};
        if(found.attendees.length > 0) {
        found.attendees.forEach((attendee) => {
            if(attendee.email === req.body.email) {
                return res.render('attendee/existEmail.ejs');
            } else {
                return next();
            }
        });
    } else {
        return next();
    }
});
};


//LOADING ALL ATTENDEE
attendeeController.loadAllAttendee = (req, res, next) => {
    findAllAttendee(req.params.id,(err, found) => {
        if(err) {
            throw err;
        } else {
            req.attendees = found[0].attendees;
            next();
        }
    });
}


//DELETE ONE PARTICULAR ATTENDEE
attendeeController.deleteAttendee = (req, res, next) => {
    Seminar.update({_id: req.params.id}, {$pull: { attendees : {email: req.params.email } }}, (err, success) => {
        if(err) {throw err;} 
        else {
            return next();
        }
    });
}

//EDIT ONE PARTICULAR ATTENDEE
attendeeController.editAttendee = (req, res, next) => {
    Seminar.update({_id: req.params.id}, 
        {$set: 
            { 
                attendees : 
                    {
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email 
                    } 
            }
        }, 
        (err, success) => {
        if(err) {throw err;} 
        else {
            return next();
        }
    });
}




var findAllAttendee = (seminarId, callback) => {
    Seminar.find({_id : seminarId}, {attendees : 1}, (err, found) => {
        callback(err, found);
    })
}

var updateRefSeminar = (seminarId, newAttendee) => {
    Seminar.findByIdAndUpdate({_id : seminarId}, {$push: {attendees : newAttendee}}, (err) => {
            if(err) throw err;
        });

}

module.exports = attendeeController;