import { useContext, useMemo, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { getRecipientDetails } from '../helpers/helpers';
import { useAuth } from '../hooks/useAuth';
import Avatar from './Avatar';
import { groupImage } from '../helpers/constants';
import PropTypes from 'prop-types';
import { PanelViewContext } from '../context/PanelViewContext';
import EmptyState from './EmptyState';
import Loader from './Loader';

const ChatList = ({ showSearch }) => {
  const { user } = useAuth();
  const { chats, currentChat, selectCurrentChat } = useContext(ChatContext);
  const { width, viewPanel } = useContext(PanelViewContext);
  const [isLoading, setIsLoading] = useState(true);

  // memoize all chats
  const memoizedAllChats = useMemo(() => chats, [chats]);

  useEffect(() => {
    if (chats.length > 0) {
      setIsLoading(false);
    }
  }, [chats]);

  const handleShowChat = (chat) => {
    selectCurrentChat(chat);
    viewPanel();
  };

  return (
    <div className={`h-dvh flex flex-col ${showSearch && 'hidden'}`}>
      {isLoading ? (
        <Loader />
      ) : memoizedAllChats?.length === 0 ? (
        <EmptyState message="Search user to start a conversation" />
      ) : (
        <>
          {memoizedAllChats.map((chat) => {
            // console.log('CHAT', chat);

            let recipient;
            if (!chat.isGroup) {
              recipient = getRecipientDetails(user, chat.users);
            }

            const chatImage = chat.isGroup ? groupImage : recipient.avatarImage;
            const chatName = chat.isGroup ? chat.chatName : recipient.username;

            return (
              <button
                key={chat?._id}
                className={`w-full hover:bg-gray-100 flex items-center gap-2 m-0 p-4 border-b border-gray-300 cursor-pointer ${
                  width > 480 && chat?._id === currentChat._id
                    ? 'bg-orange-100'
                    : 'bg-none'
                }`}
                onClick={() => handleShowChat(chat)}
              >
                <Avatar
                  online={true}
                  userImage={chatImage}
                  isGroup={chat.isGroup}
                />
                <span className="text-lg">
                  {/* If group-chat, then return chatName else return the opposite-user/sender */}
                  {chatName}
                </span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ChatList;

ChatList.propTypes = {
  showSearch: PropTypes.bool.isRequired,
  showCurrentChat: PropTypes.func
};
