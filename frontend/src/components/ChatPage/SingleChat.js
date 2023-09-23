import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import {
  Box,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { getSenderName, getSenderObject } from "../../config/logics";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import typingAnimation from "../../assets/loaders/animation_lksfu20r_small.gif";

const URI = "http://localhost:3500";

const endPoint = "http://localhost:3500";
var socket, selectedChatCompare;
export default function SingleChat({ fetchChatsAgain, setFetchChatsAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnedted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useChat();

  const toast = useToast();

  useEffect(() => {
    selectedChat._id && fetchChats();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(endPoint);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnedted(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  // console.log(notification,"-------------")

  useEffect(() => {
    socket.on("message recived", (newMessageRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        if (!notification.includes(newMessageRecived)) {
          setNotification([newMessageRecived, ...notification]);
          setFetchChatsAgain(!fetchChatsAgain);
        }
      } else {
        setMessages([...messages, newMessageRecived]);
      }
    });
  });

  ///////////////////scroll
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      await axios
        .get(`${URI}/api/message/${selectedChat._id}`, config)
        .then((res) => {
          // console.log(res.data.message);
          setMessages(res.data.message);
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: "Error Occured",
        description: "Failed to fetch chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        await axios
          .post(
            `${URI}/api/message`,
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
          )
          .then((res) => {
            // console.log(res.data.message);
            socket.emit("new message", res.data.message);
            setMessages([...messages, res.data.message]);
          });
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Logic

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLenght = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLenght && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLenght);
  };

  // console.log(selectedChat)
  return (
    <>
      {selectedChat._id ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat({});
              }}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderObject(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchMessages={fetchChats} />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <Box
                display={"flex"}
                flexDirection={"column"}
                overflowY={"scroll"}
                ref={scrollContainerRef}
                className="hide-scrollbar"
              >
                {/*  */}
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {/* {isTyping ? <div>typing...</div>:<></>} */}
              {isTyping ? (
                <Image
                  position={"absolute"}
                  top={"-60%"}
                  zIndex={"1"}
                  src={typingAnimation}
                  ms={"4px"}
                  mb={"4px"}
                  height={"20px"}
                  style={{ borderRadius: "40px" }}
                />
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3}>
            Select a Friend to Chat With!!!
          </Text>
        </Box>
      )}
    </>
  );
}
