const express = require('express')
const Joi = require('joi')
const gravatar = require('gravatar')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const { Auth } = require('../middlewares/auth')
const { Mongoose, mongo, Types } = require('mongoose')
const { findById } = require('../models/Post')

const router = express.Router()

const schema = Joi.object().keys({
    id: Joi.string().required(),
    token: Joi.string().required()
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)
    
    if (error) {
        res.json({error: `${error.details[0].message}`})
    } else {
        const { token, id } = req.body
        try {
            const checkToken = await Auth(req.body)
            if (checkToken.error) {
                res.json({error: "invalid token"})
            } else {
                const Posts = await Post.findById(Types.ObjectId(id))
                //console.log(post)
                const Comments = []
                for (const key of Posts.comment) {
                    const Temp = await Comment.findById(Types.ObjectId(key))
                    Comments.push(Temp)
                }
                if (Posts.anonymous === true) {
                    let random = Math.floor(Math.random() * 10000)
                    //console.log(random)
                    Posts.authorName = "Anonymous"
                    const avatar = gravatar.url(`${random}`, {s: "200", r: "x", d: "retro"})
                    Posts.avatar = avatar
                }
                Comments.forEach((data, index) => {
                    //console.log(index)
                    //console.log(data)
                    if (data.anonymous === true) {
                        let random = Math.floor(Math.random() * 10000)
                        //console.log(random)
                        data.authorName = "Anonymous"
                        const avatar = gravatar.url(`${random}`, {s: "200", r: "x", d: "retro"})
                        data.avatar = avatar
                    }
                })
                res.json({
                    post: Posts,
                    comment: Comments
                })
                
            }
        } catch (err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})

module.exports = router