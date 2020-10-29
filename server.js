const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./config/database')
const login = require('./routes/login')
const register = require('./routes/register')

const app = express()
app.use(bodyParser.json())

connectDB()

app.use('/login',login)
app.use('/register',register)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`now listening at port ${PORT}...`)
})