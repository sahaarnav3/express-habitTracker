const User = require('../models/users')
//below controllers will be used to render the landing page which will include the account login or creation option--

module.exports.landing = (req, res) => {
    if (req.isAuthenticated())
        return res.render('homepage')
    res.render('landing');
}

module.exports.loginUser = (req, res) => {
    // res.render('homepage');
    passport.authenticate('local', {
        failureRedirect: '/',
        successRedirect: '/homepage'
    });
    // res.send('loggedin');
}

module.exports.createUser = async (req, res) => {
    // res.redirect('/'); // try to flash a message to show user that account created
    // res.json(req.body);
    if(req.body.password !== req.body['confirm-password'])
            return res.json({ "Error": "Please enter correct password in both the fields. Try Again" });
        let newUser = "";
    try {
        newUser = await User.create(new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }));
        // console.log(newUser);
    } catch (err) {
        console.log("This error occured in creating the user -- ", err);
        if(err.code == 11000)
            return res.json({ 'Error': 'This User Already Exists. Try Again With Another Email' });
        return res.redirect('/');
    }
    res.json({ 'Success': 'User Created. Now You Can Log-In.' });
}