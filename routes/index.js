const express = require('express');
const router = express.Router();

//This is the controller for the landing page where login and user registration takes place
const landingPageController = require('../controllers/landing_page_controller');


console.log('Router Loaded');

router.get('/', landingPageController.landing);



module.exports = router;