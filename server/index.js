const express = require("express");
const cors = require('cors')
const chats = require("./data/data");
const connectDB = require("./config/connectDB");
const path = require('path')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3500;

////////////Middlewares//////////


app.use(express.json())
app.use(cors())
connectDB();



app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/user',require('./routes/userRoutes'));
app.use('/api/chat',require('./routes/chatRoutes'));
app.use('/api/message',require('./routes/messageRoutes'));

// Deployment-----------------

const __dirname1 = path.resolve()
if(process.env.NODE_ENV==='production'){

  app.use(express.static(path.join(__dirname1,"..",'/frontend/build')))

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"..","frontend","build","index.html"))
  })


}else{
  app.get("/", (req, res) => {
    res.send("hello world");
  });
}
// Deployment-----------------
const server = app.listen(PORT, () => {
  console.log(`Server is Listning on Port:${PORT}`);
});

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors:{
    origin:"http://localhost:3000",
  }
})

io.on("connection",(socket)=>{
  console.log("connected to socket io")
  socket.on("setup",(userData)=>{
    socket.join(userData._id)
    console.log(userData._id)
    socket.emit("connected")

})  

socket.on("join chat",(room)=>{
  socket.join(room)
  console.log("User Joined Room"+room);
})


socket.on('typing',(room)=>socket.in(room).emit('typing'))
socket.on('stop typing',(room)=> socket.in(room).emit('stop typing'))


socket.on("new message",(newMessageRecived)=>{
  var chat = newMessageRecived.chat
  if(!chat.users) return console.log('chat.users not defined')

  chat.users.forEach((user)=>{
    if(user._id==newMessageRecived.sender._id) return

    socket.in(user._id).emit("message recived",newMessageRecived)
    
  })

})


socket.off('setup',()=>{
  console.log("User Disconnected")
  socket.leave(userData._id)
})


})

