const express = require('express');
const router = express.Router();
const passport = require('passport');

//This is the controller for the landing page where login and user registration takes place
const landingPageController = require('../controllers/landing_page_controller');


console.log('Router Loaded');

router.get('/', landingPageController.landing);
router.post('/login-user', passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/'
}));
router.post('/create-user', landingPageController.createUser);



module.exports = router;