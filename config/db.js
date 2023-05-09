
const mongoose = require('mongoose')
require('dotenv').config()
const connection = async () => {

    try {
        await mongoose.connect(process.env.mongoUrl)
        console.log("Cnnected to MongoDB")
    } catch (error) {
        console.log("Failed to connect", error)
    }

}

module.exports = { connection }