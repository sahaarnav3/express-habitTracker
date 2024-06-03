const User = require('../models/users')
//below controllers will be used to render the landing page which will include the account login or creation option--

module.exports.landing = (req, res) => {
    // if(req.isAuthenticated())
    //     return res.redirect('')
    res.render('landing');
}

module.exports.loginUser = (req, res) => {
    res.send('Logged in');
}

module.exports.createUser = (req, res) => {
    // res.redirect('/'); // try to flash a message to show user that account created
    res.json(req.body);
}