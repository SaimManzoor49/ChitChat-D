import {
  Box,
  Button,
  FormControl,
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
import React, { useState } from "react";
import { useChat } from "../../context/ChatContext";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadge from "./UserBadge";

const URI = "http://localhost:3500";

export default function CreateGroupModal({ children }) {
  const [gruopName, setGroupName] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, chats, setChats } = useChat();

  const toast = useToast();

  const handleDelete = (u) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== u._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User is Already Selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
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

  const handleSubmit = async () => {
    if (!gruopName || !selectedUsers) {
      toast({
        title: "All Fields are Required",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        await axios
          .post(
            `${URI}/api/chat/group`,
            {
              name: gruopName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          )
          .then((res) => {
            setChats([res.data.group, ...chats]);

            setIsLoading(false);
            onClose();
            toast({
              title: "New Group Chat is Created",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
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
      } catch (error) {}
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create New Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search For Users"
                mb={3}
                onChange={handleSearch}
              />
            </FormControl>

            <Box display={"flex"} w={"100%"} flexWrap={"wrap"}>
              {selectedUsers.map((user, i) => {
                return (
                  <UserBadge
                    key={i}
                    user={user}
                    handleFunction={() => {
                      handleDelete(user);
                    }}
                  />
                );
              })}
            </Box>

            {isLoading ? (
              <Spinner />
            ) : (
              searchResult?.slice(0, 4).map((user, i) => {
                return (
                  <>
                    <UserListItem
                      key={i}
                      user={user}
                      handleFunction={() => {
                        handleGroup(user);
                      }}
                    />
                  </>
                );
              })
            )}

            {/*  */}
            {/*  */}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
