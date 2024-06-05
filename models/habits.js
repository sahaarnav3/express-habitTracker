const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    }
});

const Habits = mongoose.model('Habits', habitSchema);
module.exports = Habits;
