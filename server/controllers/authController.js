const asyncHandler = require("express-async-handler")
const User = require('../models/userModel')
const getToken = require('../utils/getToken')
const bcrypt = require('bcrypt')

const signupUser = asyncHandler(async(req,res)=>{

    let {name,email,password,pic} = req.body
    if(!email||!password||!name){
        return res.status(400).json({message:'all fields are requird'})
    }
    const checkUser = await User.findOne({email})
    if(checkUser){
        return res.status(400).json({message:'email is already registered'})
    }

    password = await bcrypt.hash(password,10)

    if(pic){
        const user = await User.create({name,email,password,pic})
        if(user){
            user.password = ''
            const token = getToken(user._id);
         return   res.status(200).json({message:'registered Succesfully',user:{...user._doc,token}})
        }else{
           return res.status(400).json({message:'Some Thing went wrong'})
            
        }
    }else{

        const user = await User.create({name,email,password})
        if(user){
            user.password = ''
            const token = getToken(user._id);
            return res.status(200).json({message:'registered Succesfully',user:{...user._doc,token}})
        }else{
            return res.status(400).json({message:'Some Thing went wrong'})
            
        }
        
    }
    

})



const loginUser = asyncHandler(async(req,res)=>{

    const {email,password}= req.body
    if(!email||!password){
        return res.status(400).json({message:'all fields are requird'})
    }
    
    const checkUser =  await User.findOne({email})
    if(!checkUser){
        return res.status(400).json({message:'Wrong Email'})
    }

    const checkPwd = await bcrypt.compare(password,checkUser.password);
    const token = getToken(checkUser._id)

    console.log(checkPwd);

    if(checkUser && checkPwd){
        return res.status(200).json({message:'logged In Successfully',user:{...checkUser._doc,token}})
    }else{
        return res.status(400).json({message:'Wrong Password'})
    }

})



module.exports = {signupUser , loginUser}