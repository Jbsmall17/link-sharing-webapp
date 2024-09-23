const express = require("express")
const jwt = require("jsonwebtoken")
const userModel = require("../models/users")
const emailSender = require("../emailSender")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

const authRouter = express.Router()

authRouter.post(
    "/signup",
    async(req,res)=>{
        try{
            const {email,password, confirmPassword} = req.body
            const findingUser = await userModel.findOne({email:email})
            if(findingUser){
                return res.status(400).json({
                    message: "User Already exist"
                })
            }else if(password.length < 8){
                return res.status(400).json({
                    message: "password must be at least 8 characters"
                })
            }else if(password !== confirmPassword){
                return res.status(400).json({
                    message: "password must be equal to confirmPassword"
                })
            }else{
                const user = await userModel.create({
                email,
                password,
                confirmPassword 
                })
                if(!user){
                    return res.status(400).json({
                        message : "user creation failed"
                    })
                }

                await emailSender.sendWelcomeEmail(email)
                return res.status(201).json({
                    message : "user Created successfully",
                    data: user
                })
            }
        }catch(error){
            console.log(error, "An Error Occurred")
        }

    }
)

authRouter.post(
    "/login",
    async(req,res,)=>{
        try{
            const {email,password} = req.body
            const user = await userModel.findOne({email})
            if(!user){
                return res.status(404).json({
                    message: "user not found"
                })
            }else{
                const validate = await user.isValidPassword(password)
                if(!validate){
                    return res.status(400).json({
                        message: "either Email or password is invalid"
                    })
                }
                const token =jwt.sign(
                    {email:email,id: user._id},
                    JWT_SECRET
                )

                return res.status(200).json({
                    message: "login successfully",
                    token
                })
            }
        }catch(error){
            return res.status(500).json({
                meassage : "server error while logging-in"
            })
        }
    
    }
)


authRouter.post("/logout", async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message: "Unauthorized: No token provided"
        })
    }
    return res.status(200).json({
        message: "Logout successful"
    })
})

module.exports = authRouter