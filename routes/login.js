const express = require('express')
const Joi = require('joi')
const router = express.Router()

const schema = Joi.object().keys({
    username: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(6).max(30).required()
})

router.get('/', (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.status(400).send(error.details[0].message)
    } else {
        res.status(200).json(value)
    }

})

module.exports = router