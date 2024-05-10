import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoutes";

export const AppRoutes = () => {
  const { isAuth } = useAuth();

  // console.log(user, isAuth);

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
        element={isAuth ? <Navigate to="/" /> : <AuthPage />}
      />
      <Route path="*" element={<NotFound />} />
      {/* <Route element={isAuth ? <Navigate to="/" /> : <Login />} path="/login" />
        <Routes
          element={isAuth ? <Navigate to="/" /> : <Register />}
          path="/register"
        /> */}
    </Routes>
  );
};
