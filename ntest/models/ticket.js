const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ticket = new Schema({

    title : {
        type: String,
        required: true
    },
    forRoles : {
        type: Array,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    },
    members : {
        type: Array
    },
    goals: {
        type: Array
    },
    updates: {
        type: Array
    },
    priority: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    dateCompleted: {
        type: Date
    } 
});

module.exports = mongoose.model('Ticket', Ticket);