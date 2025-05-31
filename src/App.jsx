import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './pages/Home';
import { useAuth } from './hooks/useAuth';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoutes';
import { ChatProvider } from './context/ChatContext.jsx';
import Loader from './components/Loader';
import RenewPassword from './pages/RenewPassword';

const AuthWrapper = ({ children }) => {
  const { isAuth } = useAuth();

  if (!isAuth) return children;
  return <ChatProvider>{children}</ChatProvider>;
};

function App() {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthWrapper>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/reset-password"
          element={isAuth ? <Navigate to="/" replace /> : <RenewPassword />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthWrapper>
  );
}

export default App;

AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired
};
