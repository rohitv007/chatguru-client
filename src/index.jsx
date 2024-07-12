import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { ChatProvider } from "./context/ChatContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { AuthProvider } from "./context/AuthContext.jsx";

if (import.meta.env.APP_NODE_ENV === "production") disableReactDevTools();

// eslint-disable-next-line react/prop-types, react-refresh/only-export-components
const AuthWrapper = ({ children }) => {
  const { user } = useAuth();

  if (!user) return children;

  return (
    <ChatProvider>
      {children} {/* If user exists, render with ChatProvider */}
    </ChatProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper>
          <App />
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
