import { useContext, useMemo, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";
import ChatList from "./ChatList";
import { getSender } from "../helpers/helpers";
import SingleChat from "./SingleChat";
import { ChatContext } from "../context/ChatContext";
// import useSocket from "../hooks/useSocket";

const Interface = () => {
  const { user, logoutUser } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const { chats, currentChat, selectCurrentChat } = useContext(ChatContext);
  // const { socket, status } = useSocket();

  // memoize all chats
  const memoizedAllChats = useMemo(() => chats, [chats]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/user/logout");
      if (data.success) {
        // console.log(data.message);
        logoutUser();
      } else {
        throw new Error("Error while logging out");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Left panel - Chats and Users */}
      <div className="chats__section bg-white flex flex-col w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 border-r h-screen border-black">
        <div className="flex-grow">
          {/* Display UserList */}
          <ChatList
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            // selectChat={selectChat}
          />
          {/* Display all chats */}
          <div
            className={`p-2 overflow-y-auto max-h-[calc(100dvh-128px)] custom-scrollbar ${
              showSearch && "hidden"
            }`}
          >
            {memoizedAllChats.map((chat) => {
              // console.log(chat);
              return (
                <div
                  key={chat?._id}
                  className={`hover:bg-slate-200 flex items-center gap-2 py-4 px-2 border-b border-gray-300 cursor-pointer ${
                    chat?._id === currentChat._id && "bg-orange-100"
                  }`}
                  // onClick={() => selectChat(chat?._id)}
                  onClick={() => selectCurrentChat(chat)}
                >
                  <Avatar userImage={chat?.users[0].pic} online={true} />
                  <span className="text-xl">
                    {chat.isGroup ? chat.chatName : getSender(user, chat.users)}
                    {/* If group-chat, then return chatName else return the opposite-user/sender */}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Footer section with user info and logout button */}
        <div className="p-3 h-fit flex justify-between items-center border-t-2 border-gray-300">
          <div className="flex gap-0.5">
            <div className="mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div className="font-bold">{user?.username}</div>
          </div>
          <div>
            <button
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-3 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Right panel - Chat Messages */}
      {Object.keys(currentChat).length > 0 ? (
        <SingleChat />
      ) : (
        <div className="bg-green-100 flex flex-grow h-full items-center justify-center">
          <header className="text-center text-2xl text-gray-400">
            <div>Namaste {user?.username}&nbsp;🙏</div>
            <div>&larr; Select a Guru to&nbsp;start a&nbsp;conversation</div>
          </header>
        </div>
      )}
    </>
  );
};

export default Interface;
