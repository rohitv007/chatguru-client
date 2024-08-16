import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  const { isAuth, isLoading } = useAuth();
  // console.log(user, isAuth);

  const Loading = () => (
    <div className="bg-slate-50 flex items-center justify-center h-screen">
      <l-momentum color={"orange"}></l-momentum>
    </div>
  );

  return (
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
        element={
          isLoading ? (
            <Loading />
          ) : isAuth ? (
            <Navigate to="/" replace />
          ) : (
            <AuthPage />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
