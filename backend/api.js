const express = require("express")
const authRouter = require("./authentication/auth")
const linkRouter = require("./Routes/link")
const userRouter = require("./Routes/user/user")
const userModel = require("./models/users")
const { authorizationFunc} = require("./helpers")
const cors = require("cors")
require("dotenv").config()
const db = require("./db/db")


const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
db.connectTodb()

app.use(cors({origin : "*"}))

app.use("/api",authRouter)

app.use("/api/user",
    authorizationFunc,
    userRouter
)

app.use("/api/link",
    authorizationFunc,
    linkRouter
)

app.get("/api/:id",async(req,res)=>{
    const id = req.params.id
    try{
        const user = await userModel.findOne({_id: id})
        if(!user){
            return res.status(404).json({
                message: "user not found",
                data:  null               
            })
        }
        return res.status(200).json({
            message: "A user successfully retrieved",
            data: user
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message: "Server error while getting user",
            data: null
        });
    }
})

app.use((err,req,res,next)=>{
    res.status(500).json({
        data:null,
        error: err
    })
})

app.listen(PORT,()=>{
    console.log(`locolhost:${PORT}`)
})