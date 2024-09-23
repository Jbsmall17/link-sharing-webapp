const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URL = process.env.MONGODB_URL


async function connectTodb(){
    mongoose.connect(MONGODB_URL)

    mongoose.connection.on("connected",()=>{
        console.log("connect successfully")
    })

    mongoose.connection.on("error",()=>{
        console.log("unable to connect")
    })
}


module.exports = {connectTodb}