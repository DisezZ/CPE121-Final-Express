const express = require('express')
const Joi = require('joi')
const gravatar = require('gravatar')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/default.json')

const router = express.Router()

const schema = Joi.object().keys({
    username: Joi.string().min(6).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.json({error: `${error.details[0].message}`})
    } else {
        const { username, email, password } = req.body

        try {
            let userCheck = await User.findOne({ username })
            let emailCheck = await User.findOne({ email })
            if(userCheck) {
                res.json({error: "\"username\" already exists"})
            } else if(emailCheck) {
                res.json({error: "\"email\" already exists"})
            } else {
                const avatar = gravatar.url(email, {s: "200", r: "x", d: "retro"})
                const dateCreated = Date.now()
                user = new User({username, email, avatar, password, dateCreated})
                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(password, salt)
                await user.save()
                const payload = {
                    user: {
                        id: user.id
                    }
                }
                jwt.sign(payload, config.jwtSecret, {expiresIn:'7d'}, (err,token) => {
                    if(err) throw err
                    res.json({token:`${token}`, value: "finished"})
                })
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})

module.exports = router

