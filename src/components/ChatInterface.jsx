import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import useWebSocket from "../hooks/useWebSocket";
import Avatar from "./Avatar";
import UserChats from "./UserChats";

const ChatInterface = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const { user, logoutUser } = useAuth();
  const { messageData } = useWebSocket();

  // to set all users which are online
  useEffect(() => {
    if (messageData) {
      console.log("messageData =>", messageData);
      const parsedUsers = JSON.parse(messageData);
      const onlineUsersMap = parsedUsers?.online?.reduce(
        (acc, { userId, username }) => {
          acc[userId] = username;
          return acc;
        },
        {}
      );
      if (onlineUsersMap) {
        setOnlineUsers(onlineUsersMap);
        console.log("ONLINE-USERS =>", onlineUsersMap);
      }
    }
  }, [messageData]);

  useEffect(() => {
    (async function () {
      1;
      const res = await axios.get("/people");
      const allUsers = res.data;
      console.log("API data =>", res.data);
      const offlineArr = allUsers
        .filter((u) => u.id !== user?.id)
        .filter((p) => !Object.keys(onlineUsers).includes(p._id));
      // console.log(offlineArr);

      const offlineData = {};
      offlineArr.forEach((u) => (offlineData[u._id] = u.username));
      console.log("offline users =>", offlineData);
      setOfflineUsers(offlineData);
    })();
    console.log("ALL ONLINE -", onlineUsers);
  }, [onlineUsers, user]);

  // populating all other users except the user itself
  const onlineUsersExceptCurrUser = { ...onlineUsers };
  delete onlineUsersExceptCurrUser[user?.id];
  console.log("ALL EXCEPT CURRENT -", onlineUsersExceptCurrUser);

  // selecting a user from Contacts list
  const selectUser = (userId) => setCurrentUserId(userId);

  const handleLogout = async () => {
    try {
      const res = await axios.get("/logout");
      if (res.data.success) {
        // console.log(res.data.message);
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
      <div className="contacts__section bg-white flex flex-col w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 border-r h-screen border-black">
        <div className="flex-grow">
          <div className="flex mx-1 my-2 px-1 py-2 items-center gap-1">
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/color/48/smart.png"
              alt="icon"
            />
            <div className="hidden sm:flex text-xl font-semibold text-orange-500">
              Chat&nbsp;Guru
            </div>
          </div>
          <hr className="border border-gray-300" />
          <div className="px-2">
            {Object.keys(onlineUsersExceptCurrUser).map((userId) => (
              <div
                key={userId}
                className={`hover:bg-slate-200 flex items-center gap-2 py-4 px-2 border-b border-gray-200 text-xl cursor-pointer ${
                  userId == currentUserId && "bg-orange-100"
                }`}
                onClick={() => selectUser(userId)}
              >
                <Avatar
                  userId={userId}
                  username={onlineUsersExceptCurrUser[userId]}
                  online={true}
                />
                <span className="text-gray-800">
                  {onlineUsersExceptCurrUser[userId]}
                </span>
              </div>
            ))}
          </div>
          <div className="px-2">
            {Object.keys(offlineUsers).map((userId) => (
              <div
                key={userId}
                className={`hover:bg-slate-200 flex items-center gap-2 py-4 px-2 border-b border-gray-200 text-xl cursor-pointer ${
                  userId == currentUserId && "bg-orange-100"
                }`}
                onClick={() => selectUser(userId)}
              >
                <Avatar
                  userId={userId}
                  username={offlineUsers[userId]}
                  online={false}
                />
                <span className="text-gray-800">{offlineUsers[userId]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 h-fit flex justify-between items-center border-t-3 border-gray-300">
          <div className="flex items-center gap-0.5">
            <span>
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
            </span>
            <span className="font-bold ">{user.username}</span>
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
      {currentUserId ? (
        <UserChats currUserId={currentUserId} data={messageData} />
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

export default ChatInterface;
