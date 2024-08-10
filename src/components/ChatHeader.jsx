import { useContext } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import { getRecipientDetails } from "../helpers/helpers";
import { useAuth } from "../hooks/useAuth";
import { PanelViewContext } from "../context/PanelViewContext";

const ChatHeader = ({ chat }) => {
  const { user } = useAuth();
  const { width, hidePanel } = useContext(PanelViewContext);
  // console.log(chat);

  const { username, userImage } = getRecipientDetails(user, chat?.users);

  return (
    <div className="flex items-center bg-orange-100 shadow-lg w-full px-2 h-16 z-10 gap-x-2">
      {width < 480 && (
        <button className="flex items-center" onClick={hidePanel} aria-label="Go Back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="black"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          {/* <span>{unread-messages count}</span> */}
        </button>
      )}
      <div className="flex items-center gap-x-2 ml-2">
        <Avatar online={true} userImage={userImage} />
        <span className="font-semibold">
          {chat.isGroup ? chat.chatName : username}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;

ChatHeader.propTypes = {
  chat: PropTypes.object.isRequired,
  hideCurrentChat: PropTypes.func,
};
