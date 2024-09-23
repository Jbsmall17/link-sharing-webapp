const mongoose = require("mongoose")
const shortid = require("shortid")

const Schema = mongoose.Schema 

const linkSchema = new Schema({
    _id:{
        type: String,
        default: shortid.generate
    },
    platform: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    }
})


const linkModel = mongoose.model("links",linkSchema)

module.exports = linkModel