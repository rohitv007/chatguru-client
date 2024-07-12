import PropTypes from "prop-types";
import Avatar from "./Avatar";
import { getSender } from "../helpers/helpers";
import { useAuth } from "../hooks/useAuth";

const ChatHeader = ({ chat }) => {
  const { user } = useAuth();
  // console.log(chat);

  return (
    <div className="flex items-center bg-orange-100 shadow-md border-b border-black w-full px-1 py-2 h-16 z-10">
      <Avatar online={true} />
      {chat.isGroup ? chat.chatName : getSender(user, chat.users)}
    </div>
  );
};

export default ChatHeader;

ChatHeader.propTypes = {
  chat: PropTypes.object.isRequired,
};
