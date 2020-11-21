const express = require('express')
const { Auth } = require('../middlewares/auth') 

const router = express.Router()

router.get('', async (req, res) => {
    let { error } = await Auth(req.body)
    if(error) {
        res.json({error: "unauthenticated"})
    } else {
        res.json({value: "authenticated"})
    }
})

module.exports = router
