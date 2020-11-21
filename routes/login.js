const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/default.json')

const router = express.Router()

const schema = Joi.object().keys({
    userInput: Joi.string().required(),
    password: Joi.string().min(6).max(30).required()
})

router.post('/', async (req, res) => {
    const { error, value } = schema.validate(req.body)

    if(error) {
        res.json({error: `${error.details[0].message}`})
    } else {
        const { userInput, password } = req.body

        try {
            let emailCheck = await User.findOne({ email: `${userInput}` })
            if(emailCheck) {
                bcrypt.compare(password, emailCheck.password, (err, result) => {
                    if(result) {
                        //res.json({res: "result"})
                        const payload = {
                            user: {
                                id: emailCheck.id
                            }
                        }
                        jwt.sign(payload, config.jwtSecret, {expiresIn:'7d'}, (err,token) => {
                            if(err) throw err
                            res.json({token:`${token}`})
                        })
                    } else {
                        res.json({error: "\"password\" incorrect"})
                    }
                })
            } else {
                usernameCheck = await User.findOne({ username: `${userInput}` })
                if(usernameCheck) {
                    bcrypt.compare(password, usernameCheck.password, (err, result) => {
                        if(result) {
                            //res.json({error: "result"})
                            const payload = {
                                user: {
                                    id: usernameCheck.id
                                }
                            }
                            jwt.sign(payload, config.jwtSecret, {expiresIn:'7d'}, (err,token) => {
                                if(err) throw err
                                res.json({token:`${token}`})
                                
                            })
                        } else {
                            res.json({error: "\"password\" incorrect"})
                        }
                    })
                } else {
                    res.json({error: "\"username\" or \"password\" does not exist"})
                }
            }
        } catch(err) {
            console.log(err.message)
            res.json({error: "error"})
        }
    }

})

router.get('/', async (req, res) => {
    res.json({error: 'finished'})
})

module.exports = router