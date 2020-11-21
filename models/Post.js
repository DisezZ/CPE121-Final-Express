const { string } = require('joi')
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    authorName: {
        type: String,
        require: true
    },
    authorID: {
        type: mongoose.Types.ObjectId,
        ref:'Post'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    topic: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    anonymous: {
        type: Boolean,
        required: true
    }
})

module.exports = Post = mongoose.model('Post',schema)