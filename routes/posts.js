const express = require('express')
const Joi = require('joi')
const gravatar = require('gravatar')
const Post = require('../models/Post')
const User = require('../models/User')
const { Auth } = require('../middlewares/auth')
const { Types } = require('mongoose')

const router = express.Router()

const schema = Joi.object().keys({
    token: Joi.string().required(),
    mainTag: Joi.array().items(Joi.string()),
    subTag: Joi.array().items(Joi.string())
})

router.get('/', async (req, res) => {
    const Posts = await Post.find({})
    res.status(200).json(Posts)
    //console.log('log posts')
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.json({error: `${error.details[0].message}`})
    } else {

        //console.log(value.mainTag)
        //res.json(value)
        const { token, mainTag, subTag } = req.body

        try {
            const checkToken = await Auth(req.body)
            if(checkToken.error) {
                res.json({error: "invalid token"})
            } else {
                const Posts = []
                if (mainTag.length === 0 && subTag.length === 0 ) {
                    const Temp = await Post.find({})
                    Posts.push(...Temp)
                    //console.log('logg')
                } else if (mainTag.length === 0) {
                    const Temp = await Post.find({})
                    subTag.forEach((tag, i) => {
                        Temp.forEach((data, j) => {
                            data.subTag.forEach((subTag) => {
                                if (tag === subTag) {
                                    //console.log(data)
                                    const checker = 0;
                                    Posts.forEach((dataCheck, k) => {
                                        if (Types.ObjectId(dataCheck.id) === data.id) {
                                            checker = -1
                                        }
                                    })
                                    if (checker === 0) {
                                        Posts.push(data)
                                    }
                                }
                            })
                        })
                    })

                } else if (subTag.length === 0) {
                    const Temp = await Post.find({})
                    mainTag.forEach((tag, i) => {
                        Temp.forEach((data, j) => {
                            if(tag === data.mainTag) {
                                Posts.push(data)
                            }
                        })
                    })

                } else {
                    const Temp = await Post.find({})
                    mainTag.forEach((tag, i) => {
                        Temp.forEach((data, j) => {
                            if(tag === data.mainTag) {
                                Posts.push(data)
                            }
                        })
                    })
                    subTag.forEach((tag, i) => {
                        Temp.forEach((data, j) => {
                            data.subTag.forEach((subTag) => {
                                if (tag === subTag) {
                                    console.log(data)
                                    const checker = 0;
                                    Posts.forEach((dataCheck, k) => {
                                        if (Types.ObjectId(dataCheck.id) === data.id) {
                                            checker = -1
                                        }
                                    })
                                    if (checker === 0) {
                                        Posts.push(data)
                                    }
                                }
                            })
                        })
                    })
                }
                Posts.forEach((data) => {
                    if (data.anonymous === true) {
                        let random = Math.floor(Math.random() * 10000)
                        //console.log(random)
                        data.authorName = "Anonymous"
                        const avatar = gravatar.url(`${random}`, {s: "200", r: "x", d: "retro"})
                        data.avatar = avatar
                    }
                })
                res.json(Posts)
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})

module.exports = router
