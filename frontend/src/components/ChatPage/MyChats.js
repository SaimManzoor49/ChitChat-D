import React, { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSenderName } from "../../config/logics";
import CreateGroupModal from "./CreateGroupModal";

const URI = "http://localhost:3500";

export default function MyChats() {
  const [isLoading, setIsLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const { chats, setChats, selectedChat, setSelectedChat, fetchChats } =
    useChat();

  const toast = useToast();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));

    const fetchChats = async () => {
      setIsLoading(true);
      const temp = JSON.parse(localStorage.getItem("user"));
      const config = {
        headers: {
          Authorization: `Bearer ${temp?.token}`,
        },
      };

      await axios
        .get(`${URI}/api/chat`, config)
        .then((res) => {
          setChats(res.data.chats);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.response?.data?.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          setIsLoading(false);
        });
    };

    fetchChats();
  }, [setChats, toast, fetchChats]);

  return (
    <>
      <Box
        display={{ base: selectedChat._id ? "none" : "flex", md: "flex" }}
        flexDirection={"column"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        w={{ base: "100%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "20px", md: "25px" }}
          fontFamily={""}
          display={"flex"}
          w={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          My Chats
          <CreateGroupModal>
            <Button
              display={"flex"}
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              Create Group
            </Button>
          </CreateGroupModal>
        </Box>

        <Box
          display={"flex"}
          flexDirection={"column"}
          p={3}
          bg={"#F8F8F8"}
          w={"100%"}
          h={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat, i) => {
                return (
                  <Box
                    onClick={() => {
                      setSelectedChat(chat);
                    }}
                    cursor={"pointer"}
                    bg={selectedChat._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat._id === chat._id ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={i}
                  >
                    <Text>
                      {!chat?.isGroupChat
                        ? getSenderName(loggedUser, chat?.users)
                        : chat.chatName}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
}
