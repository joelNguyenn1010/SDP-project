const AttendeeBuilder = require('../Data/attendee/attendee');
const Attendee = require('../model/attendees');
const Seminar = require('../model/seminar');
const fs = require('fs')
var { promisify } = require('util');
var attendeeController = {};
//REGISTER SEMINAR FOR ATTENDEE AND GENERATE PDF
attendeeController.registerSeminar = (req, res, next) => {
    // updateOrAddAttendee(req, res, next)
    var newA = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    }
    updateRefSeminar(req.body.seminarId, newA);
    createPDF(newA);
    req.flash('info', "Success, You have registed the seminar")
    return res.redirect('/seminar');
}

//CHECK CAPACITY
attendeeController.checksAvailability = (req, res, next) => {
    Seminar.findById({ _id: req.body.seminarId }, (err, found) => {
        if (err) throw err;
        if (found.attendees.length < found.capacity && req.body.email.length > 0 && req.body.name.length > 0 && req.body.phone.length > 0) {
            return next();
        } else {
            req.flash('error', 'This seminar is not available anymore');
            return res.redirect('back');
        }
    });
};


//CHECK EXISTING EMAIL IN ATTENDEE
attendeeController.checkExistingAttendee = (req, res, next) => {
    var seminarId = null;
    if (req.body.seminarId) {
        seminarId = req.body.seminarId;
    } else {
        seminarId = req.params.id;
    }
    var findMatches = promisify(findAttendee);
    findMatches(seminarId, req)
        .then((result) => {
            console.log(result);
            if (result) {
                req.flash('error', 'Email already exist');
                return res.redirect(`back`);
            } else {
                return next();
            }
        })
        .catch((err) => {
            console.log(err)
        })


    // checkEmailChanging(seminarId, req, res, next);

    // //find atteendee by ID
    // Seminar.findById({ _id: seminarId }, (err, found) => {
    //     if (err) { console.log(err); };
    //     //RESUlT AS ARRAY AND FIND IT
    //     if (found.attendees.length > 0) {
    //         found.attendees.forEach((attendee) => {
    //             if (attendee.email === req.body.email) {
    //                 req.flash('error', "Email already exist");
    //                 return res.redirect('back');
    //             } else {
    //                 return next();
    //             }
    //         });
    //     } else {
    //         return next();
    //     }
    // });
};

//CHECKING CHANGING OF THE EMAIL IN EDIT AND EMAIL EXISTING IN EDIT
attendeeController.checkingExistEmailEdit = (req, res, next) => {
    var notChanging = req.body.attendeeOldEmail === req.body.email ? true : false
    if (notChanging) {
        return next();
    } else {
        var findMatches = promisify(findAttendee);
        findMatches(req.params.id, req)
            .then((result) => {
                console.log(result);
                if (result) {
                    req.flash('error', 'Email already exist');
                    return res.redirect(`back`);
                } else {
                    return next();
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    // if (req.body.attendeeOldEmail) {
    //     var notChanging = req.body.attendeeOldEmail === req.body.email ? true : false
    //     if (notChanging) {
    //         return next();
    //     } else {
    //         findAttendee(seminarId, req, res, next);
    //     }
    // } else {
    //     findAttendee(seminarId, req, res, next);
    // }
}


//function to find atendees
var findAttendee = async (seminarId, req, callback) => {
    Seminar.findById({ _id: seminarId }, (err, found) => {
        if (err) {
            callback(err);
        };
        // found.attendees.forEach((attendee) => {
        //     if (attendee.email === req.body.email) {
        //         callback(null, attendee.email);
        //     }
        // });

        for (var i = 0; i < found.attendees.length; i++) {
            if (found.attendees[i].email === req.body.email) {
                callback(null, found.attendees[i].email);
                break;
            }
        }
        return callback(null, null);
    });

}

//LOADING ALL ATTENDEE
attendeeController.loadAllAttendee = (req, res, next) => {
    findAllAttendee(req.params.id, (err, found) => {
        if (err) {
            throw err;
        } else {
            req.attendees = found[0].attendees;
            next();
        }
    });
}


//DELETE ONE PARTICULAR ATTENDEE
attendeeController.deleteAttendee = (req, res, next) => {
    deleteOneAttendee(req, res, next);
    return next();
    // Seminar.update({ _id: req.params.id }, { $pull: { attendees: { email: req.params.email } } }, (err, success) => {
    //     if (err) { throw err; }
    //     else {
    //         return next();
    //     }
    // });
}

var deleteOneAttendee = (req, res, next) => {
    Seminar.update({ _id: req.params.id }, { $pull: { attendees: { email: req.params.email } } }, (err, success) => {
        if (err) { throw err; }
    });
}

//EDIT ONE PARTICULAR ATTENDEE
attendeeController.editAttendee = async (req, res, next) => {

    var newA = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    }
    await deleteOneAttendee(req, res, next);
    await updateRefSeminar(req.params.id, newA);
    await createPDF(newA);
    req.flash('info', "Success edit attendee");
    return res.redirect('back');
    // Seminar.update({ _id: req.params.id},
    //     {
    //         $set:
    //         {
    //             attendees:
    //             {
    //                 name: req.body.name,
    //                 phone: req.body.phone,
    //                 email: req.body.email
    //             }
    //         }
    //     },
    //     (err, success) => {
    //         if (err) { throw err; }
    //         else {
    //             var newA = {
    //                 name: req.body.name,
    //                 phone: req.body.phone,
    //                 email: req.body.email
    //             }
    //             createPDF(newA)
    //             return next();
    //         }
    //     });
}

// PRINT NAME TAG
attendeeController.createNametag = async (req, res, next) => {
    var download = promisify(downloadPDF);
    var att = req.params.email;
    download(res, att)
        .then(
            console.log('succes donwloand')
        ).catch((error) => {
            req.flash('error', "There something wrong with PDF file, please contact admin")

            return res.redirect('back');
        });
}

//DOWNLOAD FILE PDF
var downloadPDF = (res, attendee) => {
    try {
        var checking = fs.readFileSync(`public/components/pdf/${attendee}.pdf`);
        var file = `public/components/pdf/${attendee}.pdf`;
        return res.download(file);

    } catch (err) {
        req.flash('error', "There something wrong with PDF file, please contact admin")
        return res.redirect('back');
    }
}
//function to create pdf file
var createPDF = (attendee) => {
    const fs = require('fs');
    const pdf = require('pdfkit');


    let doc = new pdf();
    const t = attendee.name;
    const e = attendee.email;
    doc.pipe(fs.createWriteStream(`public/components/pdf/${attendee.email}.pdf`));
    height = doc.currentLineHeight();
    doc.fontSize(42);
    doc.text(t);
    doc.end();
}
//function to delete pdf file
var deletePDF = (attendee, callback) => {
    fs.unlink(`public/components/pdf/${attendee.email}.pdf`, (err) => {
        if (err) {
            callback(err);
        }
    })
}

//function to find all attendee
var findAllAttendee = (seminarId, callback) => {
    Seminar.find({ _id: seminarId }, { attendees: 1 }, (err, found) => {
        callback(err, found);
    })
}
//function to register attendee to seminar
var updateRefSeminar = (seminarId, newAttendee) => {
    Seminar.findByIdAndUpdate({ _id: seminarId }, { $push: { attendees: newAttendee } }, (err) => {
        if (err) throw err;
    });
}

attendeeController.checkEmpty = (req, res, next) => {
    if (req.body.name.length > 0 && req.body.email.length > 0 && req.body.phone.length > 0) {
        return next();
    } else {
        req.flash('error', "Please input all field");
        return res.redirect('back');
    }
}

module.exports = attendeeController;