import { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axios';
import useSocket from '../hooks/useSocket';

export const ChatContext = createContext({
  chats: [],
  currentChat: {},
  selectCurrentChat: () => {}
});

export const ChatProvider = ({ children }) => {
  const [chats, setAllChats] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const { socket } = useSocket();

  // set all chats
  const getAllChats = useCallback(async () => {
    try {
      const { data } = await api.get('/chats');
      setAllChats(data);
      // console.log('ALL CHATS =>', data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, []);

  useEffect(() => {
    getAllChats();

    if (socket) {
      socket.on('chat accessed', getAllChats);

      return () => {
        socket.off('chat accessed', getAllChats);
      };
    }
  }, [socket, getAllChats]);

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
  children: PropTypes.node.isRequired
};
