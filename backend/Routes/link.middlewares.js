const joi = require("joi")

async function validateLink(req,res,next){
    try{
        const schema = joi.object({
            platform: joi.string().required(),
            link: joi.string().required()
        })

        await schema.validateAsync(req.body,{abortEarly: true})
        next()
    }catch(error){
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

async function validateMultipleLink(req,res,next){
    try{
        const linkArray = req.body.links
        for(let i = 0; i < linkArray.length; i++){
            const schema = joi.object({
                platform: joi.string().required(),
                link: joi.string().required()
            })
    
            await schema.validateAsync(linkArray[i],{abortEarly: true})
        }
        next()
    }catch(error){
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}


module.exports = {
    validateLink,
    validateMultipleLink
}