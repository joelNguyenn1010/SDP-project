var passport = require("passport");
var passportMiddleware = {}

passportMiddleware.authenticate = (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
      if(err){
          req.flash('error', err.message);
          return res.redirect('/user/login');
      } if(!user) {
          req.flash("error", "Username or password is incorrect");
          return res.redirect("/user/login");
      } 
      req.logIn(user, (err) => {
          if(err){
              req.flash('error', err.message);
                return res.redirect('/user/login');
          }
          next();
      });
  })(req,res,next);
};

passportMiddleware.isLoggin = (req, res, next) => {
    if(req.user) {       
       next();
    } else {
        req.flash("info", "You need to login in order to do that");
        return res.redirect('back');
    }
}

module.exports = passportMiddleware;