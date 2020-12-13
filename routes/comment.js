const express = require('express')
const Joi = require('joi')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const { Auth } = require('../middlewares/auth')
const { Mongoose, mongo, Types } = require('mongoose')

const router = express.Router()

const schema = Joi.object().keys({
    to: Joi.string().required(),
    content: Joi.string().max(5000).required(),
    token: Joi.string().required(),
    anonymous: Joi.boolean().required()
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.json({error: `${error.details[0].message}`})
    } else {
        const { token, content, anonymous, to } = req.body
        try {
            const checkToken = await Auth(req.body)
            if(checkToken.error) {
                res.json({error: "invalid token"})
            } else {
                comment = new Comment({
                    authorName: checkToken.id.username,
                    authorID: checkToken.id.id,
                    postID: Types.ObjectId(to),
                    content: content,
                    avatar: checkToken.id.avatar,
                    anonymous: anonymous,
                    dateCreated: Date.now()
                })
                await comment.save()
                const post = await Post.findById(Types.ObjectId(to))
                console.log(typeof post.comment)
                post.comment.push(Types.ObjectId(comment.id))
                //const posted = (await Post.findById(post.id)).populate('id')
                //console.log(posted)
                post.save()
                res.json({value: 'finished'})
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})

module.exports = router
