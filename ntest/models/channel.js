const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Channel = new Schema({

    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    messages: {
        type: Array
    }
});

module.exports = mongoose.model('Channel', Channel);
