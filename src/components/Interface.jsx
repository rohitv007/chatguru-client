import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import ListFooter from './ListFooter';
import SingleChat from './SingleChat';
import NoChatsPanel from './NoChatsPanel';
import { PanelViewContext } from '../context/PanelViewContext';
import ListContainer from './ListContainer';
// import useSocket from "../hooks/useSocket";

const Interface = () => {
  const { currentChat } = useContext(ChatContext);
  const { isShowPanel, width } = useContext(PanelViewContext);
  // const { socket, status } = useSocket();

  return (
    <div className="h-dvh flex flex-grow overflow-y-hidden custom-scrollbar">
      {/* Left panel - Chats and Users */}
      {(!isShowPanel || width >= 480) && (
        <div className="container bg-white flex flex-col min-w-[300px] w-[480px] sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-gray-400">
          {/* Display Users and Chats */}
          <ListContainer />
          {/* Footer section with user-info and logout */}
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
