const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    sprite: {
        type: String
    },
    motto: {
        type: String
    },
    status: {
        type: Number
    },
    channels: {
        type: Array
    }
});

module.exports = mongoose.model('User', User);