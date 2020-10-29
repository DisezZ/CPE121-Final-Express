const express = require('express')
const Joi = require('joi')
const gravatar = require('gravatar')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

const schema = Joi.object().keys({
    username: Joi.string().min(6).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
})

router.post('/', async(req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.status(400).send(error)
    } else {
        const { username, email, password } = req.body

        try {
            let user = await User.findOne({ email })
            if(user) {
                res.status(400).json('401')
            } else {
                const avatar = gravatar.url(email, {s: "200", r: "x", d: "retro"})
                const dateCreated = Date.now()
                user = new User({username, email, avatar, password, dateCreated})
                const salt = await bcrypt.genSalt(10)
                 user.password = await bcrypt.hash(password, salt)
                await user.save()
                res.status(201).json('201')
            }
        } catch {
            res.status(500).json('500')
        }
        
    }
})

module.exports = router

