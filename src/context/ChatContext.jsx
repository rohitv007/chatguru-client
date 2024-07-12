import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";

export const ChatContext = createContext({
  chats: [],
  currentChat: {},
  selectCurrentChat: () => {},
});

export const ChatProvider = ({ children }) => {
  const [chats, setAllChats] = useState([]);
  const [currentChat, setCurrentChat] = useState({});

  // set all chats
  useEffect(() => {
    async function getAllChats() {
      const { data } = await axios.get("/chat");
      // console.log("CHATS =>", data);
      setAllChats(data);
    }
    getAllChats();
  }, []);

  const selectCurrentChat = useCallback((chat) => {
    // console.log(chat);
    setCurrentChat(chat);
  }, []);

  return (
    <ChatContext.Provider value={{ chats, currentChat, selectCurrentChat }}>
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
