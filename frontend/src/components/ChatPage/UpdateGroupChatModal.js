import React, { useState } from "react";
import { useChat } from "../../context/ChatContext";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadge from "./UserBadge";
import axios from "axios";
import UserListItem from "./UserListItem";

const URI = "http://localhost:3500";

export default function UpdateGroupChatModal({ fetchMessages }) {
  const [gruopName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user, fetchChats, setFetchChats } =
    useChat();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRename = async () => {
    if (!gruopName.length) {
      return;
    }

    // console.log(gruopName);

    setRenameLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    console.log(selectedChat); ///////////////////////
    await axios
      .put(
        `${URI}/api/chat/renamegroup`,
        {
          chatId: selectedChat._id,
          chatName: gruopName,
        },
        config
      )
      .then((res) => {
        setSelectedChat(res.data.chat);
        setFetchChats(!fetchChats);

        setRenameLoading(false);
        // console.log(searchResult);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response.data.message || "error",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setRenameLoading(false);
      });

    setGroupName(null);
  };

  const handleRemove = async (userr) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin Can Remove Users :_)",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    await axios
      .put(
        `${URI}/api/chat/removefromgroup`,
        {
          chatId: selectedChat._id,
          userId: userr._id,
        },
        config
      )
      .then((res) => {
        userr._id === user._id
          ? setSelectedChat({})
          : setSelectedChat(res.data.user);
        setFetchChats(!fetchChats);
        fetchMessages();
        setIsLoading(false);
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
        setIsLoading(false);
      });
  };

  const handleAddUser = async (userr) => {
    if (selectedChat.users.find((u) => u._id === userr._id)) {
      toast({
        title: "User is Already in the Group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin Can Add Users :_)",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    await axios
      .put(
        `${URI}/api/chat/addtogroup`,
        {
          chatId: selectedChat._id,
          userId: userr._id,
        },
        config
      )
      .then((res) => {
        setSelectedChat(res.data.user);
        setFetchChats(!fetchChats);
        setIsLoading(false);
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
        setIsLoading(false);
      });
  };

  const handleSearch = async (e) => {
    setIsLoading(true);
    const query = e.target.value;
    setSearch(query);
    // console.log(search);

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
        // console.log(searchResult);
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

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        display={{ base: "flex" }}
        onClick={() => {
          onOpen();
        }}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} flexWrap={"wrap"} w={"100%"} pb={3}>
              {selectedChat.users.map((user, i) => (
                <UserBadge
                  user={user}
                  key={i}
                  handleFunction={() => {
                    handleRemove(user);
                  }}
                />
              ))}
            </Box>

            <FormControl display={"flex"}>
              <Input
                placeholder="Change Group Name"
                mb={3}
                value={gruopName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={3}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add New Member"
                mb={1}
                onChange={(e) => {
                  handleSearch(e);
                }}
              />
            </FormControl>

            {isLoading ? (
              <Box display={"flex"} justifyContent={"center"} w={"100%"} mt={3}>
                <Spinner />
              </Box>
            ) : (
              searchResult.slice(0, 5).map((user, i) => (
                <UserListItem
                  key={i}
                  user={user}
                  handleFunction={() => {
                    handleAddUser(user);
                  }}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleRemove(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
