import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Interface from '../components/Interface';
import { PanelViewContextProvider } from '../context/PanelViewContext';
import Loader from '../components/Loader';

const Home = () => {
  const { isAuth, isLoading } = useAuth();
  // console.log("HOME DATA", user);

  if (isLoading) return <Loader />;

  if (!isAuth) return <Navigate to="/login" replace />;

  return (
    <main className="flex flex-row relative h-fit">
      <PanelViewContextProvider>
        <Interface />
      </PanelViewContextProvider>
    </main>
  );
};

export default Home;
