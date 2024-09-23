const express = require("express")
const userController = require("./user.controller")


const userRouter = express.Router()

// endpoint to get all users

userRouter.get("/",
    userController.getAllUsers
)

// endpoint to get a user
userRouter.get("/:id",
    userController.getUser
)

// endpoint to update a user
userRouter.patch("/:id",
    userController.updateUser
)

// endpoint to delete a user
userRouter.delete("/:id",
    userController.deleteUser
)

module.exports = userRouter