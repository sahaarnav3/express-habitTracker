const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new localStrategy({
    usernameField: 'email'
},
    async (email, password, done) => {
        try {
            const userData = await User.findOne({ email: email });
            if (!userData) {
                console.log("Error in finding the User --> Passport");
                return done(null, false, { message: "No user found with this email, please try again." });
            } else if (userData.password !== password){
                console.log("Entered Wrong Password");
                return done(null, false, {message: "Entered Wrong Password, please try again with correct one."})
            }
            return done(null, userData);
        } catch(err) {
            console.log("This error occured in passport while logging-in -- ", err);
            return done(null, false, {message: "Some unknown error occured. Please try again"});
        }
    }
));

//Below Functions are basially used to convert the user object received into a kind of data which can be easily stored in our 
//session storage. This data is unique identifier for the user.
passport.serializeUser((user, done) => {
    // console.log(`Serialize User Data -- user= ${user}`);
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const userData = await User.findById(id);
        return done(null, userData);
    } catch(err) {
        return (null, false, {message: "Error In Finding The User --> Passport"});
    }
})

//Now below function will be used to check even before the landing page loads if any user is already logged in or not --
// --according to the session cookie, so as to redirect the user to appropriate page.
passport.checkAuthentication = (req, res, next) => {
    if(req.isAuthenticated())
        return next();
    return res.redirect('/');
}

passport.setAuthenticatedUser = (req, res, next) => {
    if(req.isAuthenticated())
        res.locals.user = req.user;
    next();
}

module.exports = passport;