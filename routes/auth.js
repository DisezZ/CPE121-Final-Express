const express = require('express')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/default.json')
const { Auth} = require('../middlewares/auth')

const router = express.Router()

const schema = Joi.object().keys({
    token: Joi.string().required(),
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.json({error: `${error.details[0].message}`})
    } else {
        try {
            let { error } = await Auth(req.body)
            console.log(req.body)
            if(error) {
                res.json({error: "invalid token"})
                console.log({error: "invalid token"})
            } else {
                res.json({value: 'finished'})
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }
})

module.exports = router