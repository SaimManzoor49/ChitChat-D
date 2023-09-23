import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { useChat } from "../../context/ChatContext";
import ProfileModal from "../ChatPage/ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatPage/ChatLoading";
import UserListItem from "../ChatPage/UserListItem";
import { getSenderName } from "../../config/logics";
// import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import NotificationBadge from "react-notification-badge";
import Effect from "react-notification-badge";

export default function Header() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");

  const URI = "http://localhost:3500";

  const navigator = useNavigate();
  const { setUser } = useChat();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChat();

  /////////////////////HandleLogout///////////////////////
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({});
    navigator("/");
  };

  //////////////////////// Drawer///////////////////////
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter User Name or Email to Find.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios
      .get(`${URI}/api/user/getusers?search=${search}`, config)
      .then((res) => {
        setSearchResult(res.data.users);
        setIsLoading(false);
        //  console.log(res)
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios
      .post(`${URI}/api/chat`, { userId }, config)
      .then((res) => {
        // console.log(chats)
        if (!chats.find((chat) => chat._id === res.data._id)) {
          setChats([res.data.chats, ...chats]);
        }

        setSelectedChat(res.data);
        // console.log(res.data)
        setLoadingChat(false);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response?.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        //   borderWidth={"5px"}
      >
        <Tooltip
          label={"Search Users to Chat with!!!"}
          hasArrow
          placement="bottom-end"
        >
          <Button variant={"ghost"} ref={btnRef} onClick={onOpen}>
            <AiOutlineSearch />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search Users
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"}>ChitChat</Text>
        <div className="">
          <Menu>
            <MenuButton p={1} position={"absolute"} right={"100px"}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <AiFillBell fontSize={"2x"} size={"1.9em"} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length ? (
                "No New Messages"
              ) : (
                <>
                  {" "}
                  {notification.map((n) => (
                    <MenuItem
                      key={n._id}
                      onClick={() => {
                        setSelectedChat(n.chat);
                        setNotification(
                          notification.filter((notif) => notif !== n)
                        );
                      }}
                    >
                      {n.chat.isGroupChat
                        ? `New Message in ${n.chat.chatName}`
                        : ` new Message From ${getSenderName(
                            user,
                            n.chat.users
                          )}`}
                    </MenuItem>
                  ))}{" "}
                </>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              py={""}
              as={Button}
              rightIcon={<MdOutlineKeyboardDoubleArrowDown />}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      {/*  */}

      {/*// //////////////////////////// Drawer//////////////// */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Find & Make Friends!!!</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} p={2}>
              <Input
                placeholder="Type here..."
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Find</Button>
            </Box>

            {isLoading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user, i) => {
                return (
                  <UserListItem
                    key={i}
                    user={user}
                    handleFunction={() => {
                      accessChat(user._id);
                    }}
                  />
                );
              })
            )}

            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/*  */}
    </>
  );
}
