const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    authorName: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        ref: 'Comment'
    },
    postID: {
        type: String,
        ref: 'Comment'
    },
    dateCreated: {
        type: Date,
        default: Date.now
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
    },
})

module.exports = Comment = mongoose.model('Comment',schema)