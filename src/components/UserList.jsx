import { useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { debounce } from "lodash";
import Avatar from "./Avatar";
import { ChatContext } from "../context/ChatContext.jsx";

const UserList = ({ showSearch, setShowSearch }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { selectCurrentChat } = useContext(ChatContext);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const { data } = await axios.get("/user/all");
        // console.log("ALL USERS =>", data);
        setAllUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    getAllUsers();
  }, []);

  const handleSearch = useCallback(() => {
    // console.log("FILTERED USERS", filteredUsers);
    // console.log("searching");
    const filtered = allUsers.filter((user) =>
      user.username.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchValue, allUsers]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(debounce(handleSearch, 300), [
    handleSearch,
  ]);

  const selectUser = async (userId) => {
    // console.log(`Chat with user - ${userId}`);
    try {
      const { data } = await axios.post("/chat", { userId });
      // console.log("UserList chat data =>", data);
      selectCurrentChat(data);
    } catch (error) {
      console.log("Error creating new chat\n", error);
    }
    setShowSearch(false);
  };

  useEffect(() => {
    debounceSearch();
    // handleSearch();
    return () => debounceSearch.cancel();
  }, [searchValue, debounceSearch]);

  return (
    <>
      {!showSearch ? (
        <>
          {/* Left Panel Header */}
          <div className="flex mx-1 my-2 px-1 py-2 items-end justify-between">
            <div className="flex items-center gap-1">
              <img
                width="36"
                height="36"
                src="https://img.icons8.com/color/48/smart.png"
                alt="icon"
              />
              <div className="text-xl font-semibold text-orange-500">
                Chat&nbsp;Guru
              </div>
            </div>
            <div className="flex">
              <button
                className="px-2"
                onClick={() => setShowSearch(!showSearch)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <hr className="border border-gray-300" />
        </>
      ) : (
        <>
          {/* Search Bar Input */}
          <div className="flex mx-1 my-4 px-2 py-1 justify-between items-center rounded-full border-2 border-orange-500">
            <input
              className="w-full border border-transparent outline-transparent px-2 py-0 rounded-full"
              type="text"
              placeholder="Search user"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              autoFocus
            />
            <button className="px-2" onClick={() => setShowSearch(!showSearch)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <hr className="border border-gray-300" />
          {/* List of all users */}
          <div className="p-2 m-0 overflow-y-auto max-h-[calc(100dvh-128px)] custom-scrollbar">
            {filteredUsers.map((user) => (
              <div key={user._id}>
                <button
                  type="button"
                  onClick={() => selectUser(user?._id)}
                  className="w-full rounded-full shadow-md flex items-center gap-2 my-2 p-2 border border-gray-300 cursor-pointer"
                >
                  <Avatar userImage={user.pic} online={true} />
                  <h3>{user.username}</h3>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default UserList;

UserList.propTypes = {
  showSearch: PropTypes.bool.isRequired,
  setShowSearch: PropTypes.func.isRequired,
};
