const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");





const sendMessage = expressAsyncHandler(async(req,res)=>{

    const {content,chatId} = req.body;

    if(!content||!chatId){
        return res.status(400).json({message:'invalid data'})
    }

    var newMessage = {
        sender:req.user._id,
        content,
        chat:chatId
    }
    
    try{
        var message = await Message.create(newMessage)
        message = await message.populate('sender','naem pic') 
        message = await message.populate('chat') 
        message = await User.populate(message,{
            path:'chat.users',
            select:'name pic email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        return res.status(200).json({message:message})

    }catch(error){
        return res.status(400).json({message:error.message})
    }
    
})
const getMessages = expressAsyncHandler(async(req,res)=>{

    try{
        const messages = await Message.find({chat:req.params.chatId}).populate('sender','name pic email').populate('chat')
        return res.status(200).json({message:messages})
    }catch(error){
        return res.status(400).json({message:error.message})
    }
    
})


module.exports = {sendMessage,getMessages}