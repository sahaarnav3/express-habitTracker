const mongoose = require('mongoose');
const Habits = require('./habits');

const habitNotesSchema = mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habits',
        required: true
    },
    note: {
        type: String,
        required: true
    }
})

const HabitNotes = mongoose.model('HabitNotes', habitNotesSchema);
module.exports = HabitNotes;