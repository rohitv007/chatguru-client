import { useAuth } from "../hooks/useAuth";

const NoChatsPanel = () => {
  const { user } = useAuth();

  return (
    <div className="bg-green-100 flex flex-grow h-full items-center justify-center">
      <div className="flex flex-col text-center text-2xl text-gray-400">
        <p>Namaste {user?.username}&nbsp;🙏</p>
        <p>Select a Guru to&nbsp;start a&nbsp;conversation</p>
      </div>
    </div>
  );
};

export default NoChatsPanel;
