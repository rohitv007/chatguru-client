import PropTypes from "prop-types";
import Avatar from "./Avatar";
import { getChatHeaderDetails } from "../helpers/helpers";
import { useAuth } from "../hooks/useAuth";

const ChatHeader = ({ chat }) => {
  const { user } = useAuth();
  // console.log(chat);

  const { username, userImage } = getChatHeaderDetails(user, chat?.users);

  return (
    <div className="flex items-center bg-orange-100 shadow-md border-b border-black w-full px-1 py-2 h-16 z-10 gap-x-4">
      <div>
        <button onClick={() => {}}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-x-2">
        <Avatar online={true} userImage={userImage} />
        {chat.isGroup ? chat.chatName : username}
      </div>
    </div>
  );
};

export default ChatHeader;

ChatHeader.propTypes = {
  chat: PropTypes.object.isRequired,
};
