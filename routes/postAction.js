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
                const check = -1;
                if (action === "like") {
                    post.liked.forEach((likedBy, index) => {
                        if (likedBy === id.id) {
                            check = index
                        }
                    })
                    if (check === -1) {
                        post.liked.push(id.id)
                        res.json({value: 'finished'})
                    } else {
                        const temp = post.liked.splice(check, 1)
                        post.liked = temp
                        console.log(post.liked)
                        res.json({value: 'finished'})
                    }
                    post.save()
                } else if (action === "upvote") {
                    post.upvoted.push(id.id)
                }
            }
        } catch (error) {
            console.log(error.message)
            res.json({error: "error"})
        }
    }
} )

module.exports = router