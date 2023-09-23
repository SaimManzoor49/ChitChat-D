import React from "react";
import { useChat } from "../../context/ChatContext";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

export default function ChatBox() {
  const { selectedChat, fetchChats, setFetchChats } = useChat();

  return (
    <>
      <Box
        display={{ base: selectedChat._id ? "flex" : "none", md: "flex" }}
        w={{ base: "100%", md: "68%" }}
        alignItems={"center"}
        flexDirection={"column"}
        p={3}
        bg={"white"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <SingleChat
          fetchChatsAgain={fetchChats}
          setFetchChatsAgain={setFetchChats}
        />
      </Box>
    </>
  );
}
