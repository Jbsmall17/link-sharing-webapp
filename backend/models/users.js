const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const shortid = require("shortid")

const Schema = mongoose.Schema

const userSchema = new Schema({
    _id : {
        type: String,
        default: shortid.generate
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    firstName : {
        type: String,
        default: ""
    },
    lastName : {
        type : String,
        default: ""
    },
    password : {
        type: String,
        required: true,
    },
    profilePicture : {
        type: String,
        default: ""
    },
    confirmPassword: {
        type: String,
        require: true
    },
    links: {
        type: Array
    },
    created_at:{
        type: Date,
        default: new Date()
    }
})

userSchema.pre(
    'save',
    async function(next){
        const user = this;
        const hash = await bcrypt.hash(user.password,10)
        const hash2 = await bcrypt.hash(user.confirmPassword,10)

        user.password = hash;
        user.confirmPassword = hash2;

        next()
    }
)

userSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password,user.password);
     
    return compare
}

const userModel = mongoose.model("users",userSchema)

module.exports = userModel