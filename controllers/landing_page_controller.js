const User = require('../models/users')
const Habit = require('../models/habits');
const HabitPerDay = require('../models/habit_per_day');
//below controllers will be used to render the landing page which will include the account login or creation option--

module.exports.landing = async (req, res) => {
    if (!req.isAuthenticated())
        return res.render('landing');

    //Lets fetch the habit list from mongoDB..
    let habitList = "";
    let habitCount = {};
    try {
        habitList = await Habit.find({ email: req.user.email });
        //Below functionality is being used to count the number of days the habit is done compared to total days.
        let habitStatusPromise = habitList.map(async (habit) => {
            return HabitPerDay.find({ habit: habit['_id']});
        })
        let habitStatuses = await Promise.all(habitStatusPromise);
        habitStatuses.forEach((habit) => {
            let id = habit[0].habit;
            let total = habit.length;
            let count = 0;
            habit.forEach(habitStatus => {
                if(habitStatus.status == "Done")
                    count++;
            })
            habitCount[id] = {'totalDays': total, 'doneDays': count};
        });
        // console.log(habitCount);
    } catch (err) {
        console.log("Error caused while fetching habit list for logged in user -- ", err);
    }

    res.render('homepage', { username: req.user.name.toUpperCase(), habitList: habitList, habitCount: habitCount });
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
    if (req.body.password !== req.body['confirm-password'])
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
        if (err.code == 11000)
            return res.json({ 'Error': 'This User Already Exists. Try Again With Another Email' });
        return res.redirect('/');
    }
    res.json({ 'Success': 'User Created. Now You Can Log-In.' });
}