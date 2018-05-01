module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Authrozied');
        res.redirect('/users/login')
    }
}