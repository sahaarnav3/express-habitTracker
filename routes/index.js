const express = require('express');
const router = express.Router();
const passport = require('passport');

//This is the controller for the landing page where login and user registration takes place
const landingPageController = require('../controllers/landing_page_controller');
const homepageController = require('../controllers/homapage_controller');


console.log('Router Loaded');

router.get('/', landingPageController.landing);
router.post('/login-user', passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/'
}));
router.post('/create-user', landingPageController.createUser);

//Below all the router are for the functioning of homepage actions.
router.post('/log-out', homepageController.destroySession);
router.post('/create-habit', homepageController.createHabit);
router.post('/delete-habit', homepageController.deleteHabit);
router.post('/fetch-dates', homepageController.fetchDates);
router.post('/update-date-status', homepageController.updateDateStatus);
router.post('/create-note', homepageController.createNote);
router.post('/fetch-notes', homepageController.fetchNotes);

module.exports = router;