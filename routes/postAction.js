const express = require('express')
const Joi = require('joi')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const { Auth } = require('../middlewares/auth')
const { Mongoose, mongo, Types } = require('mongoose')

const router = express.Router()

const schema = Joi.object().keys({
    token: Joi.string().required(),
    to: Joi.string().required(),
    action: Joi.string().required()
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.json({error: `${error.details[0].message}`})
    } else {
        const { to, token, action } = req.body
        try {
            const { id, error } = await Auth(req.body)
            if (error) {
                res.json({error: "invalid token"})
            } else {
                const post = await Post.findById(Types.ObjectId(to))
                var check = -1;
                if (action === "like") {
                    post.liked.forEach((likedBy, index) => {
                        if (likedBy.userID == id.id) {
                            check = index
                        }
                    })
                    if (check === -1) {
                        post.liked.push({
                            userID: id.id,
                            username: id.username
                        })
                        res.json({value: 'finished'})
                    } else {
                        post.liked.splice(check, 1)
                        post.liked.splice(check, 1)
                        res.json({value: 'finished'})
                    }
                    post.save()
                    //console.log(post.liked.length)
                } else if (action === "upvote") {
                    post.upvoted.forEach((upvotedBy, index) => {
                        if (upvotedBy.userID == id.id) {
                            check = index
                        }
                    })
                    if (check === -1) {
                        post.upvoted.push({
                            userID: id.id,
                            username: id.username
                        })
                        res.json({value: 'finished'})
                    } else {
                        post.upvoted.splice(check, 1)
                        post.upvoted.splice(check, 1)
                        res.json({value: 'finished'})
                    }
                    post.save()
                    //console.log(post.liked.length)
                }
            }
        } catch (error) {
            console.log(error.message)
            res.json({error: "error"})
        }
    }
} )

module.exports = router