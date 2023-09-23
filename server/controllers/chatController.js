const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return res.status(200).json({message:"got Chat",fullChat:isChat[0]});
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res.status(200).json({ message: "new Chat is created", fullChat });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
});

const getChats = asyncHandler(async (req, res) => {
  try {
    const userChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name email pic",
        });
        return res
          .status(200)
          .json({ message: "got all chats", chats: result });
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

const createGroup = asyncHandler(async (req, res) => {
  let { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: "all fields are required" });
  }

  users = JSON.parse(users);
  users.push(req.user);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More then 2 users are required to Create a Group" });
  }

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const getChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({ message: "Group Created!!", group: getChat });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).json({ message: "all fields are Required" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(400).json({ message: "someThing went Wrong" });
  }
  return res
    .status(200)
    .json({ message: "Renamed Chat SuccessFully", chat: updatedChat });
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ message: "all fields are required" });
  }

  try {
    const addedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json({ message: "user Added", user: addedUser });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "user not Added" });
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ message: "all fields are required" });
  }

  try {
    const removedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json({ message: "user Removed", user: removedUser });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "user not removed" });
  }
});


const addPic = asyncHandler(async(req,res)=>{



})

module.exports = {
  accessChat,
  getChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
  addPic
};
