const express = require("express")
const linkMiddlewares = require("../Routes/link.middlewares")
const linkController = require("../Routes/link.controller")


const linkRouter = express.Router()
//post a link

linkRouter.post("/",
    linkMiddlewares.validateLink,
    linkController.createLink
)

// post multiple link 

linkRouter.post("/multiple",
    linkMiddlewares.validateMultipleLink,
    linkController.createMultipleLink
)

// get a user's link

linkRouter.get("/user",
    linkController.getAllLinksByUser
)


//get a link

linkRouter.get("/:id",
    linkController.getLink
)

// get all links 

linkRouter.get("/",
    linkController.getAllLinks
)

// update a link

linkRouter.patch("/:id",
    linkController.updateALink
)

// delete a link

linkRouter.delete("/:id",
    linkController.deleteALink
)


module.exports = linkRouter