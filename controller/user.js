var userMiddleware = {};
const User = require("../model/user");
const Attendee = require("../model/attendees");
const Speaker = require("../model/speaker");
const Sysadmin = require("../model/sysadmin");
const Organiser = require("../model/orginiser");
const Seminar = require('../model/seminar');
const passport = require("passport");
var { promisify } = require('util');
const publicDir = require('path').join(__dirname,'/public');
var fs = require('fs');


userMiddleware.checkAdminRole = (req, res, next) => {
    if (req.user && req.user.roles.isAdmin == true) {
        next();
    } else {
        req.flash("error", "Admin required");
        return res.redirect('/seminar');
    }
}

//ADD USER
userMiddleware.addUser = (req, res, next) => {
    var isAdmin = req.body.role === "sysadmin" ? true : false;
    var newUser = new User({
        username: req.body.username,
        roles: {
            role: req.user._id,
            role_name: req.body.role,
            isAdmin: isAdmin
        }, 
        name: req.body.firstname + " " + req.body.lastname
    });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/user/new');

        } else {
            console.log("finish create account")
            next();
        }

    });
};

userMiddleware.checkExistUserEmail = (req, res, next) => {
    User.findOne({ username: req.body.username }, (err, found) => {
        if (err) {
            req.flash("error", "Error occur when register, please try again");
            return res.redirect('/user/new');
        } else if (found) {
            req.flash("error", "The email already registed in the system, please try again with different email");
            return res.redirect('/user/new');
        } else {
            return next();
        }

    })
}


//CREATING USER AND ASSIGN THEIR ROLE
userMiddleware.createUser = (req, res, next) => {
    const name = req.body.firstname;
    const email = req.body.username;
    const phone = req.body.phone;
    const userRole = req.body.role;

    if (userRole === "sysadmin") {
        createSysadmin(req, res, next);
    }
    else if (userRole === "organiser") {
        createOrganiser(req, res, next);
    } else {
        var newSpeaker = promisify(createSpeaker);
        newSpeaker(name, phone, email)
            .then((speaker) => req.user = speaker)
            .catch((err) => {
                errorHandlingUser(err);
                return res.redirect("/user/new");
            })
            .then(next());
    }
};

//SHOW ALL SYSADMINS
userMiddleware.showAllSysdamin = async (req, res, next) => {
    await Sysadmin.find({}, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", "Unable to retrieve system admin data");
            req.sysadmin = [];
        } else if (result) {
            req.sysadmin = result;
            next();
        }
    }).maxTimeMS(100);
}
//SHOW ALL ORGANISERS
userMiddleware.showAllOrganiser = async (req, res, next) => {

    await Organiser.find({}, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", "Unable to retrieve orginiser data");
            req.orginiser = [];
        } else if (result) {
            req.orginiser = result;
            next();
        }
    });
}

//show one user
userMiddleware.showOneUser = async (req, res, next) => {
    var email = req.params.email;
    var id = req.params.id;
    var type = req.params.type;
    if (type === "sysadmin") {
        await findOneSysadmin(id, email, req, next);

    } else if (type === "organiser") {
        await findOneOrganiser(id, email, req, next);


    } else {
        return res.redirect('/error');
    }


}
//UPDATE USER
userMiddleware.updateOneUser = (req, res, next) => {

    var email = req.params.email;
    var id = req.params.id;
    var type = req.params.type;
    var phone = req.body.phone;
    var name = req.body.name;
    var role = req.body.role;

    if (type === "sysadmin") {
        updateOneSysadmin(id, name, phone, req);
        next();
    } else if (type === "organiser") {
        updateOneOrganiser(id, name, phone, req);
        next();
    } else {
        return res.redirect('/error');
    }
}

//CHECK USER WITH ACTIVE SEMINAR
userMiddleware.checkActiveSeminar = (req, res, next) => {
    var email = req.params.email;
    var type = req.params.type;
    User.findOne({
        username: email
    }, (err, found) => {
        if(err) {console.log(err)}
        else if(found) {
            findSeminarUser(found._id, req, res, next);
        } else {
            next();
        }
    });
}

var findSeminarUser = (id, req, res, next) => {
    Seminar.findOne({
        organiser: [id]
    }, (err, result) =>{
        if(err) {
            console.log(err);
        } else if(result) {
            req.flash('error', 'This user has active seminar');
            return res.redirect('back');
        } else {
           next();
        }
    })
}


//DELETE ONEUSER
userMiddleware.deleteOneUser = async (req, res, next) => {
    var id = req.body.id;
    var type = req.body.type;
    var email = req.body.email;
    User.deleteOne(
    {
        username: email
    }, (err, result) => {
        if (err) {
            req.flash('error', 'There is error when delete this user, please try again');
            console.log(err);
            return res.redirect('back');
        }
        else if (result) {
            deleteTypeUser(id, type, req, res);
        } else {
            deleteTypeUser(id, type, req, res);
        }
    });

    await next();
}

userMiddleware.GetAllNameTags = (req, res, next) => {
    Seminar.findById({_id: req.params.id}, (err, result)=> {
        if(err) {
            console.log(err);
            req.flash('error', 'There something wrong when generate name tags, please try again');
            return res.redirect('back');
        } else if(result) {     
            req.attendees = result.attendees
            next();
        } else {
            req.flash('error', 'There something wrong when generate name tags, please try again');
            return res.redirect('back');
        }
    })
}
userMiddleware.printAllNametags = async (req, res, next) =>{
    var fullUrl = req.protocol + '://' + req.get('host');

    const pupperteer = require('puppeteer');
        const brower = await pupperteer.launch();
        const page = await brower.newPage();
        const options = {
            path: `public/components/nametags/${req.params.id}-attendees.pdf`,
            format: 'A4'
        }
        await page.goto(`${fullUrl}/${req.params.id}/nametags`, {waitUntil: 'networkidle2'});
        await page.pdf(options);
        await brower.close();

        await downloadPDF(res, req.params.id);
}   

var downloadPDF = async (res, id) => {
    try {
        console.log(__dirname);
        // var checking = fs.readFileSync(`public/components/nametags/${id}-attendees.pdf`);
        await res.download(`public/components/nametags/${id}-attendees.pdf`);

    } catch (err) {
        console.log(err);
        req.flash('error', "There something wrong with PDF file, please contact admin")
        return res.redirect(`/seminar/${id}`);
    }
}



var deleteTypeUser = (id, type, req, res) => {
    if (type === 'sysadmin') {
        Sysadmin.deleteOne({
            _id: id
        }, (err) => {
            if (err) {
                req.flash('error', 'There is error when delete this user, please try again');
                console.log(err);
            }

        })
    }
    else if (type === 'organiser') {
        Organiser.deleteOne({
            _id: id
        }, (err) => {
            if (err) {
                req.flash('error', 'There is error when delete this user, please try again');
                console.log(err);
            }

        })
    }

}

var updateOneSysadmin = (id, name, phone, req) => {
    console.log(3);
    Sysadmin.updateOne({ _id: id },
        {
            $set:
            {
                name: name,
                phone: phone
            }
        }, (err, result) => {
            if (err) {
                console.log(err)
                req.flash("error", "Error occur, please try again")
            } else {
                console.log(2)
                // console.log(result);               
            }
        });
        User.updateOne({
            'roles.role' : id 
        }, {
            $set:
            {
                name: name
            }
        }, (err)=>{
            console.log(err);
        });
}

var updateOneOrganiser = (id, name, phone, req) =>{
    Organiser.updateOne({ _id: id },
        {
            $set:
            {
                name: name,
                phone: phone
            }
        }, (err, result) => {
            if (err) {
                console.log(err)
                req.flash("error", "Error occur, please try again")
            } else {
                console.log(2);           
            }
        });
        User.updateOne({
            'roles.role' : id
            
        }, {
            $set:
            {
                name: name
            }
        }, (err)=>{
            console.log(err);
        });
}


var findOneSysadmin = async (id, email, req, next) => {
    await Sysadmin.findOne({ _id: id, email: email }, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", "Can't load system admin data");
        } else {
            req.user = result;
            return next();
        }
    });

}

var findOneOrganiser = async (id, email, req, next) => {
    await Organiser.findOne({ _id: id, email: email }, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", "Can't load organiser data");
        } else {
            req.user = result;
            return next();
        }
    });
}

var createSysadmin = (req, res, next) => {
    var newSysadmin = new Sysadmin({
        name: (req.body.firstname + " " + req.body.lastname),
        phone: req.body.phone,
        email: req.body.username
    });

    newSysadmin.save((err, admin) => {
        if (err) {
            console.log(err);
            if (err.code === 11000) { req.flash("The email has already registed") }
            req.flash('error', err.message);
            return res.redirect("/user/new");
        } else {
            req.user = admin;
            next();
        }
    });
};

var createOrganiser = (req, res, next) => {
    var newOrganiser = new Organiser({
        name: (req.body.firstname + " " + req.body.lastname),
        phone: req.body.phone,
        email: req.body.username
    });

    newOrganiser.save((err, organiser) => {
        if (err) {
            console.log(err);
            if (err.code === 11000) { req.flash("The email has already registed") }
            req.flash('error', err.message);
            return res.redirect("/user/new");
        } else {
            req.user = organiser;
            next();
        }
    });

};

var createSpeaker = (name, phone, email, callback) => {
    var newSpeaker = new Speaker({
        name,
        phone,
        email
    });
    newSpeaker.save((err, speaker) => {
        callback(err, speaker);
    });
};

var errorHandlingUser = (err) => {
    switch (err) {
        case err.errors.email:
            req.flash('error', err.errors.email.message);
        case err.errors.name:
            req.flash('error', err.errors.name.message);
            break;
        default:
            req.flash('error', err.message);
    }
}

module.exports = userMiddleware;