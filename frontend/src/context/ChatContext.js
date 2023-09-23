import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export default function ChatContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState({});
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [fetchChats, setFetchChats] = useState(false);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user")) || {};
    // console.log(getUser)
    setUser(getUser);
  }, [setUser]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChats,
        setFetchChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  return useContext(ChatContext);
};
