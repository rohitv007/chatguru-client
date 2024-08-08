import { useContext, useMemo } from "react";
import { ChatContext } from "../context/ChatContext";
import { getRecipientDetails } from "../helpers/helpers";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";
import { groupImage } from "../helpers/constants";
import PropTypes from "prop-types";
import { PanelViewContext } from "../context/PanelViewContext";

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
      className={`p-2 overflow-y-auto max-h-[calc(100dvh-128px)] custom-scrollbar ${
        showSearch && "hidden"
      }`}
    >
      {memoizedAllChats.map((chat) => {
        // console.log(chat);
        const { username, userImage } = getRecipientDetails(user, chat.users);

        return (
          <div
            key={chat?._id}
            className={`hover:bg-gray-100 flex items-center gap-2 py-4 px-2 border-b border-gray-300 cursor-pointer ${
              width > 480 && chat?._id === currentChat._id
                ? "bg-orange-100"
                : "bg-none"
            }`}
            onClick={() => handleShowChat(chat)}
          >
            <Avatar
              online={true}
              userImage={chat.isGroup ? groupImage : userImage}
            />
            <span className="text-xl">
              {/* If group-chat, then return chatName else return the opposite-user/sender */}
              {chat.isGroup ? chat.chatName : username}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;

ChatList.propTypes = {
  showSearch: PropTypes.bool.isRequired,
  showCurrentChat: PropTypes.func,
};
