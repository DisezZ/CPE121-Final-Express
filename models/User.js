const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    birthDate: {
        type: Date,
        default: null
    },
    posted: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: []
    }]
})

module.exports = User = mongoose.model('User',schema)