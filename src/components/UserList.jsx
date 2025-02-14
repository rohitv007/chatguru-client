import { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Avatar from './Avatar';
import { ChatContext } from '../context/ChatContext.jsx';
import { PanelViewContext } from '../context/PanelViewContext';
import api from '../api/axios';
import useSocket from '../hooks/useSocket';
import EmptyState from './EmptyState';
// import useSocket from '../hooks/useSocket';

const UserList = ({ showSearch, setShowSearch }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { selectCurrentChat } = useContext(ChatContext);
  const { viewPanel } = useContext(PanelViewContext);
  const { socket } = useSocket();

  useEffect(() => {
    async function getAllUsers() {
      try {
        const { data } = await api.get('/users/all');
        // console.log("ALL USERS =>", data);
        setAllUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    getAllUsers();

    if (socket) {
      socket.on('userAdded', (newUser) => {
        setAllUsers((prevUsers) => [...prevUsers, newUser]);
      });

      return () => {
        socket.off('userAdded');
      };
    }
  }, [socket]);

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
    handleSearch
  ]);

  const selectUser = async (userId) => {
    // console.log(`create/select chat with user - ${userId}`);
    try {
      const { data } = await api.post('/chats', { userId });
      // console.log("UserList chat data =>", data);
      selectCurrentChat(data);
      viewPanel();
      // console.log('create/access chat', data);
      socket.emit('join chat', data._id);
    } catch (error) {
      console.log('Error creating new chat\n', error);
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
        <div className="border-b-2 border-gray-300">
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
                ChatGuru
              </div>
            </div>
            <div className="flex">
              <button
                className="px-2"
                aria-label="Search"
                onClick={() => setShowSearch(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
        </div>
      ) : (
        <>
          {/* Search Bar Input */}
          <div className="flex py-4 px-2 justify-between items-center border-b-2 border-gray-300">
            <div className="flex flex-1 items-center justify-normal rounded-full border-2 border-orange-500">
              <input
                className="w-full px-4 py-2 rounded-full focus:border-orange-500 focus:outline-none"
                type="text"
                placeholder="Search user"
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                autoFocus
              />
              {searchValue && (
                <button className="pr-2" onClick={() => setSearchValue('')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="gray"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                    onClick={() => setSearchValue('')}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button className="m-0 px-1" onClick={() => setShowSearch(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
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
          {/* List of all users */}
          <div className="m-0 px-2 overflow-y-auto max-h-[calc(100dvh-128px)] custom-scrollbar">
            {filteredUsers?.length === 0 ? (
              <EmptyState message="No users found" />
            ) : (
              <>
                {filteredUsers.map((user) => (
                  <div key={user._id}>
                    <button
                      type="button"
                      onClick={() => selectUser(user?._id)}
                      className="w-full rounded-full shadow-md flex items-center gap-2 my-2 p-2 border border-gray-300 cursor-pointer"
                    >
                      <Avatar userImage={user.avatarImage} online={true} />
                      <h3>{user.username}</h3>
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserList;

UserList.propTypes = {
  showSearch: PropTypes.bool.isRequired,
  setShowSearch: PropTypes.func.isRequired
};
