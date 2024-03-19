module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.render('/home');      
    },
    ensureAdmin: function(req, res, next) {
      if (req.isAuthenticated() && req.user.email =="admin@gmail.com") {
        return next();
      }
      req.flash('error_msg', "You don't have Admin Priveleges");
      res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.render('/home');      
    }
  };