
const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Workshop', workshopSchema);
