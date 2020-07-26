const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    localName: {
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
    },
    friends: {
        type: Array
    },
    conversations: {
        type: Array
    },
    blockedList: {
        type: Array
    }
});

module.exports = mongoose.model('User', User);