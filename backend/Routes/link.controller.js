const linkModel = require("../models/link")
const userModel = require("../models/users")
require("dotenv").config()

// create a link
async function createLink(req,res){
    try{
        const linkObj = req.body
        const createLink = await linkModel.create({
            platform: linkObj.platform,
            link: linkObj.link,
            userId: req.userId
        })

        const user = await userModel.findOne({email : req.userEmail})
        if(user){
            await userModel.findByIdAndUpdate(
                {_id: req.userId,email : req.userEmail},
                {
                    $set : {
                        links: [ ...user.links, createLink]
                    }
                },
                {new: true}
            )
        }

        res.status(201).json({
            message: "link created successfully",
            data : createLink
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "server error",
            data: null
        })
    }

}

// create multiple link 

async function createMultipleLink(req,res){
    try{
        const linkArray = req.body.links
        const createdLinkArray = []
        if(linkArray.length == 0){
            return res.status(400).json({
                message: "no link added",
                data : []
            })
        }
        for(let i = 0; i < linkArray.length; i++){
            const findLink = await linkModel.findOne({
                link: linkArray[i].link,
                userId: req.userId
            })
            if(findLink){
                continue
            }
            const createLink = await linkModel.create({
                platform: linkArray[i].platform,
                link: linkArray[i].link,
                userId: req.userId
            })
            createdLinkArray.push(createLink)
            const user = await userModel.findOne({email : req.userEmail})
            if(user){
                await userModel.findByIdAndUpdate(
                    {_id: req.userId,email : req.userEmail},
                    {
                        $set : {
                            links: [ ...user.links, createLink]
                        }
                    },
                    {new: true}
                )
            } 
        }
        
        return res.status(201).json({
            message: "All links has been created successfully",
            data : createdLinkArray
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "server error",
            data: null
        })
    }

}

// get a single link
async function getLink(req,res){
    try{
        const id = req.params.id
        const link = await linkModel.findById(id)
        if(!link){
            return res.status(404).json({
                message : "link not found"
            })
        }
        return res.status(200).json({
            message: "link found",
            data: link
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "server error",
            data: null
        })
    }
}

// get all links

async function getAllLinks(req,res){
    try{
        const links = await linkModel.find({})
        return res.status(200).json({
            message: "Links retrieve successfully",
            data: links
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "server error",
            data : null
        })
    }
}

//get all links by a user 

async function getAllLinksByUser(req,res){
    try{
        const links = await linkModel.find({userId: req.userId})
        return res.status(200).json({
            message: "user's link retrieved",
            data: links
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message : "server error",
            data: null
        })
    }
}

// to upadate a link by a user

async function updateALink(req,res){
    const id = req.params.id
    const newInfo = req.body
    const {userId} = req
    try{
        const link = await linkModel.findOneAndUpdate(
            {_id:id,userId: userId},
            { $set: newInfo},
            {new : true}
        )

        if(!link){
            return res.status(404).json({
                message : "Link not found or you don't have permission to update it",
                data : null
            }) 
        }

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message : "you don't have permission to update it",
                data : null
            })
        }

        const userLinks = user.links
        const linkIndex = userLinks.findIndex(({_id})=>{
            return _id == id
        })
        userLinks.splice(linkIndex,1,link)
        await userModel.findOneAndUpdate(
            {_id: req.userId,email : req.userEmail},
            { $set:{links : userLinks}},
            {new : true}
        )


        return res.status(200).json({
            message : "link updated successfully",
            data : link
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message: "Server error while updating the link",
            data: null
        });
    }
    
}

// to delete a link  by a user

async function deleteALink(req,res){
    const id = req.params.id
    const {userId} = req
    try{
        const deletedLink = await linkModel.findOneAndDelete({
            _id: id, userId : userId
        })
        if(!deletedLink){
            return res.status(404).json({
                message : "Link not found or you don't have permission to delete it",
                data : null
            }) 
        }
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message : "you don't have permission to delete it",
                data : null
            })
        }
        const usersLink = user.links

        const filteredArray = usersLink.filter(({_id})=>{
            return _id !== id 
        })

        await userModel.findOneAndUpdate(
            {_id: req.userId,email : req.userEmail},
            { $set:{links : filteredArray}},
            {new : true}
        )

        return res.status(200).json({
            message: "Link successfully deleted",
            data: deletedLink
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message: "Server error while deleting the link",
            data: null
        });
    }

}

module.exports = {
    createLink,
    createMultipleLink,
    getLink,
    getAllLinks,
    getAllLinksByUser,
    updateALink,
    deleteALink
}