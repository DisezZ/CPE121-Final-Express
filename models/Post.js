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
    comment: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
        default: []
    }],
    liked: [{
        userID: mongoose.Types.ObjectId,
        userName: String
    }],
    upvoted: [{
        userID: mongoose.Types.ObjectId,
        userName: String
    }],
    anonymous: {
        type: Boolean,
        required: true
    },
    mainTag: {
        type: String,
        required: true
    },
    subTag: [{
        type: String
    }]
})

module.exports = Post = mongoose.model('Post',schema)