import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import api from '../api/axios';

export const AuthContext = createContext({
  authState: null,
  isLoading: true,
  error: '',
  loginUser: () => {},
  logoutUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ user: null, isAuth: false });
  const [isLoading, setIsLoading] = useState(true);

  const loginUser = async (credentials) => {
    try {
      const { data } = await axios.post(`/user/login`, credentials, {
        'Content-Type': 'application/json',
      });
      // console.log(data);
      setAuthState({ user: data.user, isAuth: true });
      setIsLoading(false);
      localStorage.setItem('accessToken', data.accessToken);
      return data;
    } catch (error) {
      console.error(error.response.data);
      throw error;
    }
  };

  const logoutUser = () => {
    setAuthState({ user: null, isAuth: false });
    localStorage.removeItem('accessToken');
  };

  const checkAuthAccess = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const { data } = await api.get('/profile');
        // console.log(data);

        if (data.success && token === data.accessToken) {
          setAuthState({ user: data.user, isAuth: true });
        } else {
          logoutUser();
        }
      } catch (error) {
        console.error('Auth check failed', error);
        logoutUser();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...authState, isLoading, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
