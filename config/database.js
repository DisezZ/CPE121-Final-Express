const mongoose = require('mongoose')

const config = require('./default.json')
const database = config.mongoURI

const connectDB = async ()=>{
    try { 
        await mongoose.connect(database,{
        useNewUrlParser: true,
        useUnifiedTopology: true})

        console.log('Mongodb connect...')
    } catch(err) {
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = connectDB