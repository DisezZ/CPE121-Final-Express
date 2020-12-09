const express = require('express')
const Joi = require('joi')
const Post = require('../models/Post')
const User = require('../models/User')
const { Auth } = require('../middlewares/auth')
const { Types } = require('mongoose')

const router = express.Router()

const schema = Joi.object().keys({
    token: Joi.string().required(),
    filter: Joi.object().keys({
        mainTag: Joi.array().items(Joi.string()),
        subTag: Joi.array().items(Joi.string())
    })
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

        //console.log(value.filter.mainTag)
        //res.json(value)
        const { token, filter } = req.body

        try {
            const checkToken = await Auth(req.body)
            if(checkToken.error) {
                res.json({error: "invalid token"})
            } else {
                const Posts = []
                if (filter.mainTag.length === 0 && filter.subTag.length === 0 ) {
                    const Temp = await Post.find({})
                    Posts.push(...Temp)
                    //console.log('logg')
                    res.json(Posts)
                } else if (filter.mainTag.length === 0) {
                    const Temp = await Post.find({})
                    filter.subTag.forEach((tag, i) => {
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
                    res.json(Posts)

                } else if (filter.subTag.length === 0) {
                    const Temp = await Post.find({})
                    filter.mainTag.forEach((tag, i) => {
                        Temp.forEach((data, j) => {
                            if(tag === data.mainTag) {
                                Posts.push(data)
                            }
                        })
                    })
                    res.json(Posts)

                } else {
                    const Temp = await Post.find({})
                    filter.mainTag.forEach((tag, i) => {
                        Temp.forEach((data, j) => {
                            if(tag === data.mainTag) {
                                Posts.push(data)
                            }
                        })
                    })
                    filter.subTag.forEach((tag, i) => {
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
                    res.json(Posts)
                }
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})

module.exports = router
