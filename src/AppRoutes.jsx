import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";


export const AppRoutes = () => {
  const { isAuth } = useAuth();

  // console.log(user, isAuth);

  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={isAuth ? <Navigate to="/" /> : <AuthPage />} path="/login" />
      {/* <Route element={isAuth ? <Navigate to="/" /> : <Login />} path="/login" /> */}
      {/* <Route
        element={isAuth ? <Navigate to="/" /> : <Register />}
        path="/register"
      /> */}
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
};
