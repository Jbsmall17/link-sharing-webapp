const userModel = require("../../models/users")
const linkModel = require("../../models/link")


// get a user

async function getUser(req,res){
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
}
// get all users

async function getAllUsers(req,res){
    try{
        const users = await userModel.find({})
        if(!users){
            return res.status(404).json({
                message: "users not found",
                data:  null               
            })
        }
        return res.status(200).json({
            message: "All users successfully retrieved",
            data: users
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message: "Server error while getting users",
            data: null
        });
    }
}
//update a user

async function updateUser(req,res){
    const id = req.params.id
    const newInfo = req.body
   try{
    const user = await userModel.findByIdAndUpdate(
        {_id: id},
        {$set: newInfo},
        {new: true}
    )
    if(!user){
        return res.status(404).json({
            message : "user not found",
            data : null
        }) 
    }
    return res.status(200).json({
        message: "user successfully updated",
        data: user
    })
   }catch(error){
    console.log(error.message)
    return res.status(500).json({
        message: "Server error while updating the user",
        data: null
    });
   }
}
// delete a users

async function deleteUser(req,res){
    const id = req.params.id
    try{
        const user = await userModel.findByIdAndDelete(id)
        if(!user){
            return res.status(404).json({
                message : "user not found",
                data : null
            }) 
        }
        const query = {userId: id}
        await linkModel.deleteMany(query)        

        return res.status(200).json({
            message : "user successfully deleted",
            data: user
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
        message: "Server error while deleting the user",
        data: null
    });
    }
}

module.exports = {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
}