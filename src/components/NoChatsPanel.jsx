import { useAuth } from '../hooks/useAuth';

const NoChatsPanel = () => {
  const { user } = useAuth();

  return (
    <div className="h-dvh flex flex-grow items-center justify-center bg-gradient-to-br from-green-300 to-green-100 p-6 shadow-lg">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-medium text-gray-700 mb-2">
          Namaste {user?.username} 🙏
        </h1>
        <p className="text-lg text-gray-500">
          Select a Guru to start a conversation
        </p>
      </div>
    </div>
  );
};

export default NoChatsPanel;
