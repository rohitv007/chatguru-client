import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";

export const AuthContext = createContext({
  authState: null,
  isLoading: true,
  authUser: () => {},
  logoutUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ user: null, isAuth: false });
  const [isLoading, setIsLoading] = useState(true);

  const authUser = async (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    setAuthState({ user: data, isAuth: true });
    setIsLoading(false);
  };

  const logoutUser = async () => {
    localStorage.removeItem("accessToken");
    setAuthState({ user: null, isAuth: false });
    setIsLoading(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    accessToken && setAuthState({ user: null, isAuth: true });

    (async function () {
      try {
        const res = await axios.get("/profile");
        // console.log("CONTEXT DATA =>", res.data);
        authUser(res.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access. Redirecting to login page...");
        } else {
          console.error("Error fetching profile:", error);
        }
        logoutUser();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [authState.isAuth]);

  return (
    <AuthContext.Provider
      value={{ ...authState, isLoading, authUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
