module.exports = {
    ensureAuthentication : function(req, res , next) {
        if(req.isAuthenticated()) {
            return next()
        }
        
        req.flash('error_msg' , 'You should login to view page')
        res.redirect('/user/login');
    }
}