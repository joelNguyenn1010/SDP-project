//SET UP constIABLE
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const publicDir = require('path').join(__dirname,'/public');
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require("connect-flash");
//SECURITY
const RateLimit = require('express-rate-limit');

const limiter = new RateLimit({
	windowMs: 10*60*1000,
	max: 50,
	delayMs: 0
});

//DEFINE MODEL
const User = require("./model/user");
//RETRIEVE CONFIG
const config = require("./config");

//SET UP ROUTE
const main = require("./router/main/index");
const user = require('./router/user/user');
const seminar = require('./router/seminar/seminar');
const attendee = require('./router/attendee/attendee');

//SET UP NODE CONFIG

app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//SET UP SESSION

app.use(session({
	secret: "SDP project envaewfawef",
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 180*60*1000 }
}));

//SET UP PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//SET UP MLab
mongoose.connect(config.mongoose);

//SET UP GLOBAL
app.use((req, res, next) => {
	res.locals.session = req.session;
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
});

app.use(user);
app.use(main);
app.use(seminar);
app.use(attendee);

app.get("*", (req, res) => {
	res.send('connect');
});

// app.listen(process.env.PORT, process.env.IP, () => {
// 	console.log("Welcome to our web Apllication");
// });

module.exports = app;