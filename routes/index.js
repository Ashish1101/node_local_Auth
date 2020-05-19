const express = require('express')
const router = express.Router();
const { ensureAuthentication } = require('../config/auth')
router.get('/' ,  (req, res) => {
    res.send("Welcome");
})

router.get('/dashboard', ensureAuthentication , (req, res) => {
    res.render('dashboard', {
        user : req.user
    });
})

module.exports = router;