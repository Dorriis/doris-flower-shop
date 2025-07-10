const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    response: {
        type: String,
        required: false,
    },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
