import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  pic: "",
};

export default function Signup() {
  const [state, setState] = useState(initialState);
  const [showPwd, setShowPwd] = useState(false);
  const [pic, setPic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const URI = "http://localhost:3500";

  const navigator = useNavigate();
  const toast = useToast();

  const { setUser } = useChat();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const { name, email, password, confirmPassword } = state;
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all fields ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password dosen't match ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
      return;
    }

    await axios
      .post(`${URI}/api/auth/signup`, state)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsLoading(false);
        setUser(res.data.user);
        navigator("/chats");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response?.data?.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setIsLoading(false);
        return;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const uploadImage = async () => {
    if (!pic) {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pic.type === "image/*" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chitChat");
      data.append("cloud_name", "dukjlbovc");
      await axios
        .post(process.env.REACT_APP_CLOUD_URI, data)
        .then((res) => {
          // console.log(res.data.url)
          setState((s) => ({ ...s, pic: res.data.url.toString() }));
          // console.log(state.pic)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  return (
    <>
      <VStack spacing={"8px"}>
        <FormControl id="first-name" isRequired colorScheme="gray">
          <FormLabel>Name</FormLabel>
          <Input
            onChange={handleChange}
            name="name"
            placeholder={"Enter Your Name"}
            colorScheme="gray"
            type="text"
          />
        </FormControl>
        <FormControl id="signup_email" isRequired colorScheme="gray">
          <FormLabel>Email</FormLabel>
          <Input
            onChange={handleChange}
            name="email"
            placeholder={"Enter Your Email"}
            colorScheme="gray"
            type="email"
          />
        </FormControl>
        <FormControl id="signup_password" isRequired colorScheme="gray">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              onChange={handleChange}
              name="password"
              placeholder={"Enter Your Password"}
              colorScheme="gray"
              type={showPwd ? "text" : "password"}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                h={"1.75rem"}
                size={"sm"}
                onClick={() => {
                  setShowPwd(!showPwd);
                }}
              >
                {showPwd ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="confirm_password" isRequired colorScheme="gray">
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              onChange={handleChange}
              name="confirmPassword"
              placeholder={"Renter Your Password"}
              colorScheme="gray"
              type={showPwd ? "text" : "password"}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                h={"1.75rem"}
                size={"sm"}
                onClick={() => {
                  setShowPwd(!showPwd);
                }}
              >
                {showPwd ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic" colorScheme="gray">
          <FormLabel>Upload Your Pic!!</FormLabel>
          <InputGroup>
            <Input
              //   placeholder={"Renter Your Password"}
              colorScheme="gray"
              type="file"
              accept="image/*"
              p={1.5}
              onChange={(e) => {
                setPic(e.target.files[0]);
              }}
            />
          </InputGroup>
        </FormControl>

        <Button
          colorScheme={state.pic ? "green" : "gray"}
          width={"100%"}
          m={"15px 0 0 0"}
          onClick={uploadImage}
          isLoading={isLoading}
        >
          {state.pic ? "Got Your Image :-)" : "Upload Image (Recomanded)"}
        </Button>
        <Button
          colorScheme="gray"
          width={"100%"}
          m={"15px 0 0 0"}
          onClick={() => {
            handleSubmit();
          }}
          isLoading={isLoading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
}
