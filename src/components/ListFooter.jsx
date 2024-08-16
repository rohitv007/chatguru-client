import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const ListFooter = () => {
  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      const { data } = await api.get('/user/logout');
      if (data.success) {
        // console.log(data.message);
        logoutUser();
      } else {
        throw new Error('Error while logging out');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
  );
};

export default ListFooter;
