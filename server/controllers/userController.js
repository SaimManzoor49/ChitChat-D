const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")



const getUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{}

    let users = (await User.find(keyword).find({_id:{$ne:req.user._id}}));
     users = users.map((u)=>{
        u.password=''
        return u
    })

    if(users.length){

        return res.status(200).json({message:'got users',users})
    }
    return res.status(400).json({message:'No User Found'})


})




module.exports = {getUsers}