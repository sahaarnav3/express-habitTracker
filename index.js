const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose')
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);
// app.use(session({
//     name: 'habitTracker',
//     secret: 'secret', 
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } 
// }))


//extract css and javascript files from the sub-pages into layout.
app.set('layout extractStyles', true);
app.set('layout extractScript', true);

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//Using express router
app.use('/', require('./routes'));

const listener = app.listen(process.env.PORT || 3000, (err) => {
    if (err)
        console.log(`Error in running the server: ${err}`);
    console.log('Your app is listening on port: ' + listener.address().port);
})