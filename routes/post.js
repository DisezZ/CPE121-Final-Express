const express = require('express')
const Joi = require('joi')
const Post = require('../models/Post')
const User = require('../models/User')
const { Auth } = require('../middlewares/auth')

const router = express.Router()

const schema = Joi.object().keys({
    topic: Joi.string().max(50).required(),
    content: Joi.string().max(5000).required(),
    token: Joi.string().required(),
    anonymous: Joi.boolean().required()
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.json({error: `${error.details[0].message}`})
    } else {
        const { token, topic, content } = req.body

        try {
            const checkToken = await Auth(req.body)
            if(checkToken.error) {
                res.json({error: "invalid token"})
            } else {
                post = new Post({
                    authorName: checkToken.username,
                    authorID: checkToken.id,
                    topic: topic,
                    content: content,
                    avatar: checkToken.avatar
                })
                await post.save()
                const user = await User.findById(checkToken.id)
                const posted = (await Post.findById(post.id)).populate('id')
                user.save()
                res.json({value: 'finished'})
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})

module.exports = router
