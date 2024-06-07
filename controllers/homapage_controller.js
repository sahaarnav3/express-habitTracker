const User = require('../models/users');
const Habit = require('../models/habits');
const habitPerDay = require('../models/habit_per_day');


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
        //after creating the habit we will add the status of 7 days (7 days before the date of creation);
        //we have the task id in newHabit.
        const habitDates = []; // Used to store 7 dates from current date.
        let currentDate = new Date();
        //Below function is used to create 7 days of habit_per_day and insert it at the end.
        for (let i = 0; i < 7; i++) {
            const newDate = new Date(currentDate.getTime() - (i * 1000 * 60 * 60 * 24));
            const newHabitDate = new habitPerDay({
                habit: newHabit._id,
                date: newDate,
                status: 'No Action'
            });
            habitDates.push(newHabitDate);
        }
        await habitPerDay.insertMany(habitDates);
        // console.log(habitDatesReturnedData);

    } catch (err) {
        console.log('This error occurred in creating the habit -- ', err);
        return res.redirect('/');
    }
    res.redirect('/');
}

//Below controller will help fetch all the day status (since creation) for habit ..
module.exports.fetchDates = async (req, res) => {
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }
    let fetchedDates = {};
    try {
        const id = req.body.habitId || req.query.habitId;
        // console.log('Inside homepagecontroller id = ', id);
        fetchedDates = await habitPerDay.find({ habit: id });
        // console.log(fetchedDates);
        // console.log('Inside homepagecontroller fetchedDates = ', fetchedDates);
    } catch (err) {
        console.log("Error while fetching all dates status from mongoDB -- ", err);
        return res.redirect('/');
    }
    return res.json(fetchedDates);
}

//Below Controller function will be used to update to status of habit for that particular date -- 
module.exports.updateDateStatus = async(req, res) => {
    if(!req.isAuthenticated())
        return res.redirect('/');
    // console.log(req.body.habitPerDayId, req.body.status);
    let updatedData = "";
    try {
        updatedData = await habitPerDay.findOneAndUpdate(
            {_id: req.body.habitPerDayId},
            {status: req.body.status},
            {runValidators: true, new: true});
        // console.log(updatedData);
        if(!updatedData)
            return res.status(400).json({ message: "Failed to update status" });
        return res.status(200).json(updatedData);
    } catch(err) {
        console.log("Error While Updating The Status of Task for a Particular Date -- ", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//Below controller would be used to delete habit from mongoDB
module.exports.deleteHabit = async (req, res) => {
    // console.log('Habit id: ', req.body);
    if (!req.isAuthenticated())
        return res.redirect('/');
    try {
        await Habit.deleteOne({ _id: req.body['habit-id'] });
        await habitPerDay.deleteMany({ habit: req.body['habit-id'] });
    } catch (err) {
        console.log("Error While Deleting Habit : ", err);
    }
    res.redirect('/');
}