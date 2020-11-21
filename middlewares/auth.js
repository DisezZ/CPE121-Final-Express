const Joi = require('joi')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')
const config = require('../config/default.json')

const schema = Joi.object().keys({
    token: Joi.string().required()
})

Auth = async (JWT) => {
    try {
        let verified = jwt.verify(JWT.token,config.jwtSecret)
        //console.log(verified.user)
        let idCheck = await User.findById(verified.user.id)
        return { id: idCheck, error: "" }
    } catch(err) {
        return {error: 'error'}
    }
}

module.exports =  { Auth }

