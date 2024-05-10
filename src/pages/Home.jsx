import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ChatInterface from "../components/ChatInterface";

const Home = () => {
  const { isAuth } = useAuth();
  // console.log("HOME DATA", user?.id);

  return !isAuth ? (
    <Navigate to="/login" replace />
  ) : (
    <main className="flex flex-row relative h-screen">
      <ChatInterface />
    </main>
  );
};

export default Home;
