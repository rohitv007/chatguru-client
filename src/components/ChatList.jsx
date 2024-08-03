import { useContext, useMemo } from "react";
import { ChatContext } from "../context/ChatContext";
import { getRecipientDetails } from "../helpers/helpers";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";
import { groupImage } from "../helpers/constants";
import PropTypes from "prop-types";

const ChatList = ({ showSearch }) => {
  const { user } = useAuth();
  const { chats, currentChat, selectCurrentChat } = useContext(ChatContext);
  // memoize all chats
  const memoizedAllChats = useMemo(() => chats, [chats]);

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
            className={`hover:bg-slate-200 flex items-center gap-2 py-4 px-2 border-b border-gray-300 cursor-pointer ${
              chat?._id === currentChat._id && "bg-orange-100"
            }`}
            onClick={() => selectCurrentChat(chat)}
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

export default ChatList

ChatList.propTypes = {
  showSearch: PropTypes.bool.isRequired,
};
