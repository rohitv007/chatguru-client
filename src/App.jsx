import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  const { isAuth } = useAuth();
  // console.log(user, isAuth);
  
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
      <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <AuthPage />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
