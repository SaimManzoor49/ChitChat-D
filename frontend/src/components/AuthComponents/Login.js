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
  email: "",
  password: "",
};

export default function Login() {
  const [state, setState] = useState(initialState);
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useChat();

  const toast = useToast();
  const navigator = useNavigate();
  const URI = "http://localhost:3500";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const { email, password } = state;
    if (!email || !password) {
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
    await axios
      .post(`${URI}/api/auth/login`, state)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsLoading(false);
        setUser(res.data?.user);
        navigator("/chats");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "something went wrong while loging in",
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

  return (
    <>
      <VStack spacing={"8px"}>
        <FormControl id="email" isRequired colorScheme="gray">
          <FormLabel>Email</FormLabel>
          <Input
            onChange={handleChange}
            name="email"
            placeholder={"Enter Your Email"}
            colorScheme="gray"
            type="email"
            value={state.email}
          />
        </FormControl>
        <FormControl id="password" isRequired colorScheme="gray">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              onChange={handleChange}
              name="password"
              placeholder={"Enter Your Password"}
              colorScheme="gray"
              type={showPwd ? "text" : "password"}
              value={state.password}
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

        <Button
          colorScheme="gray"
          width={"100%"}
          m={"15px 0 0 0"}
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Login
        </Button>
        <Button
          colorScheme="red"
          width={"100%"}
          m={"5px 0 0 0"}
          onClick={() => {
            setState({ email: "guest@example.com", password: "123456" });
          }}
        >
          Guest User
        </Button>
      </VStack>
    </>
  );
}
