import { useState } from 'react';
import ChatList from './ChatList';
import UserList from './UserList';

const ListContainer = () => {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="flex-grow">
      <UserList showSearch={showSearch} setShowSearch={setShowSearch} />
      <ChatList showSearch={showSearch} />
    </div>
  );
};

export default ListContainer;
