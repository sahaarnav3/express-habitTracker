const User = require('../models/users');
const Habit = require('../models/habits');


module.exports.destroySession = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error Logging Out.");
        }
        res.redirect('/');
    })
}

module.exports.createHabit = async (req, res) => {
    if (!req.isAuthenticated())
        return req.redirect('/');

    let newhabit = ""
    try {
        newHabit = await Habit.create(new Habit({
            email: req.user.email,
            title: req.body['habit-name'],
            startDate: new Date()
        }));
        // console.log(newHabit);
    } catch (err) {
        console.log('This error occurred in creating the habit -- ', err);
        return res.redirect('/');
    }
    res.redirect('/');
}