import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import User from "../models/user.models.js"

export const test =(req , res)=>{
    res.json({message : "Api Route is Working !!! "})
}


export const updateUser = async(req , res)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can Only Update your own account"))
        try {
         if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password , 10)
         }
         const updateUser = await User.findByIdAndUpdate(req.params.id , {$set : {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            avatar : req.body.avatar, 
         }}, {new :true  , runValidators : true})
         const {password , ...rest} = updateUser._doc;
         res.status(200).json(rest)

        } catch (error) {
            next(error)
        }
}