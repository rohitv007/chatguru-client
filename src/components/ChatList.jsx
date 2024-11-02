import { useContext, useMemo } from 'react';
import { ChatContext } from '../context/ChatContext';
import { getRecipientDetails } from '../helpers/helpers';
import { useAuth } from '../hooks/useAuth';
import Avatar from './Avatar';
import { groupImage } from '../helpers/constants';
import PropTypes from 'prop-types';
import { PanelViewContext } from '../context/PanelViewContext';

const ChatList = ({ showSearch }) => {
  const { user } = useAuth();
  const { chats, currentChat, selectCurrentChat } = useContext(ChatContext);
  const { width, viewPanel } = useContext(PanelViewContext);
  // memoize all chats
  const memoizedAllChats = useMemo(() => chats, [chats]);

  const handleShowChat = (chat) => {
    selectCurrentChat(chat);
    viewPanel();
  };

  return (
    <div
      className={`px-2 py-0 overflow-y-auto max-h-screen custom-scrollbar ${
        showSearch && 'hidden'
      }`}
    >
      {memoizedAllChats?.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <p className="text-center text-xl font-semibold">
            Search user to start a conversation
          </p>
        </div>
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
                className={`w-full hover:bg-gray-100 flex items-center gap-2 py-4 px-2 border-b border-gray-300 cursor-pointer ${
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
