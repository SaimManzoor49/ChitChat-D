import React, { useEffect } from "react";
import { useChat } from "../../context/ChatContext";
import Header from "../../components/Header/Header";
import MyChats from "../../components/ChatPage/MyChats";
import ChatBox from "../../components/ChatPage/ChatBox";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";





export default function Chats() {
  const { user } = useChat();
  const navigator = useNavigate()




  useEffect(()=>{
    if(!user.name){
      navigator('/')
    }

  },[navigator,user])


  return (
    <>
      <div style={{ width: "100%" }}>
        <Header />
        <Box 
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
        >
        <MyChats />
        <ChatBox/>

        </Box>


      </div>
    </>
  );
}
