const express = require('express')
const Joi = require('joi')
const Post = require('../models/Post')
const User = require('../models/User')
const { Auth } = require('../middlewares/auth')
const { array } = require('joi')

const router = express.Router()

const schema = Joi.object().keys({
    token: Joi.string().required()
})

router.get('/', async (req, res) => {
    const Posts = await Post.find({})
    res.status(200).json(Posts)
    console.log('log posts')
})

/*router.post('/', async (req, res) => {
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
                //console.log(checkToken.id)
                //res.json(checkToken)
                post = new Post({
                    authorName: checkToken.username,
                    authorID: checkToken.id,
                    topic: topic,
                    content: content
                })
                await post.save()
                res.json({value: 'finished'})
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})*/

module.exports = router
