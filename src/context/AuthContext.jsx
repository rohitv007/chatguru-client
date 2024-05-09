import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";

export const AuthContext = createContext({
  authState: null,
  authUser: () => {},
  logoutUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ user: null, isAuth: false });

  const authUser = async (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    setAuthState({ user: data, isAuth: true });
  };

  const logoutUser = async () => {
    localStorage.removeItem("accessToken");
    setAuthState({ user: null, isAuth: false });
  };

  useEffect(() => {
    (async function () {
      // if (authState?.user) {
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
      }
      // }
    })();
  }, [authState.isAuth]);

  return (
    <AuthContext.Provider value={{ ...authState, authUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
