import { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import ListFooter from './ListFooter';
import SingleChat from './SingleChat';
import NoChatsPanel from './NoChatsPanel';
import { PanelViewContext } from '../context/PanelViewContext';
import UserList from './UserList';
import ChatList from './ChatList';
// import useSocket from "../hooks/useSocket";

const Interface = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { currentChat } = useContext(ChatContext);
  const { isShowPanel, width } = useContext(PanelViewContext);
  // const { socket, status } = useSocket();

  return (
    <div className="h-dvh flex flex-grow overflow-x-hidden custom-scrollbar">
      {/* Left panel - Chats and Users */}
      {(!isShowPanel || width >= 480) && (
        <div className="flex flex-col h-dvh bg-white min-w-[300px] w-[480px] sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-gray-400 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* display search-bar and users */}
            <UserList showSearch={showSearch} setShowSearch={setShowSearch} />
            {/* display chats */}
            <ChatList showSearch={showSearch} />
          </div>
          {/* display footer */}
          <ListFooter />
        </div>
      )}
      {/* Right panel - Chat Messages */}
      {isShowPanel && (
        <div className="flex flex-grow min-w-[350px]">
          {Object.keys(currentChat).length > 0 ? (
            <SingleChat />
          ) : (
            <NoChatsPanel />
          )}
        </div>
      )}
    </div>
  );
};

export default Interface;
