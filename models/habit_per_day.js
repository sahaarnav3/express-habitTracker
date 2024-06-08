const mongoose = require('mongoose');
const Habits = require('./habits');

const habitPerDaySchema = new mongoose.Schema({
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habits',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Done', 'Not Done', 'No Action'],
        required: true
    }
});

const habitPerDay = mongoose.model('habitPerDay', habitPerDaySchema);
module.exports = habitPerDay;