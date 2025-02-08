const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Helper function to format the date as DD-MM-YYYY
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB').format(date);
};

const entrySchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
    },
    destination: {
        type: String,
        default: "Una market",
    },
    Leaving_date: {
        type: String, // Store formatted date as a string
        default: () => formatDate(new Date()),
    },
    Leaving_time: {
        type: String, // Store only the time as a string
        default: () => new Date().toLocaleTimeString('en-GB').slice(0,5),
    },
    Arrival_date: {
        type: String, // Store formatted date as a string
        default: null,
    },
    Arrival_time: {
        type: String, // Store only the time as a string
        default: null,
    },
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
