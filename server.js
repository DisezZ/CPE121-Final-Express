const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/database')
const root = require('./routes/root')
const login = require('./routes/login')
const register = require('./routes/register')
const post = require('./routes/post')
const auth = require('./routes/auth')
const posts = require('./routes/posts')

const app = express()
app.use(bodyParser.json())

connectDB()

app.use(cors())
app.use('/',root)
app.use('/login',login)
app.use('/register',register)
app.use('/post',post)
app.use('/auth',auth)
app.use('/posts',posts)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`now listening at port ${PORT}...`)
})