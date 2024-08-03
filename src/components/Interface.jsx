import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import UserList from "./UserList";
import ChatList from "./ChatList";
import ListFooter from "./ListFooter";
import SingleChat from "./SingleChat";
import NoChatsPanel from "./NoChatsPanel";
// import useSocket from "../hooks/useSocket";

const Interface = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { currentChat } = useContext(ChatContext);
  // const { socket, status } = useSocket();

  return (
    <div className="flex flex-grow overflow-y-hidden custom-scrollbar h-screen">
      {/* Left panel - Chats and Users */}
      <div
        className={`chats__section bg-white flex flex-col min-w-[350px] sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5 border-r h-screen border border-black`}
      >
        {/* Display List of Users and List of Chats */}
        <div className="flex-grow">
          <UserList showSearch={showSearch} setShowSearch={setShowSearch} />
          <ChatList showSearch={showSearch} />
        </div>
        {/* Footer section with user info and logout button */}
        <ListFooter />
      </div>
      {/* Right panel - Chat Messages */}
      <div className="flex flex-grow min-w-[350px]">
        {Object.keys(currentChat).length > 0 ? (
          <SingleChat />
        ) : (
          <NoChatsPanel />
        )}
      </div>
    </div>
  );
};

export default Interface;
