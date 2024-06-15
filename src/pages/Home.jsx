import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "ldrs/momentum";
import Interface from "../components/Interface";

const Home = () => {
  const { isAuth, isLoading } = useAuth();
  // console.log("HOME DATA", user?.id);
  

  if (isLoading) {
    return (
      <div className="bg-slate-100 flex items-center justify-center h-screen">
        <l-momentum color={"orange"}></l-momentum>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="flex flex-row relative h-screen">
      <Interface />
    </main>
  );
};

export default Home;
