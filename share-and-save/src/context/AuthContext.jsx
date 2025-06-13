import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Add axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post('http://localhost:8000/api/users/token/refresh/', {
              refresh: refreshToken
            });

            const { access } = response.data;
            localStorage.setItem('access_token', access);
            setToken(access);

            // Update the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    // Check for tokens in localStorage on initial load
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
      setToken(accessToken);
      // Fetch user data
      fetchUserData(accessToken);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = async (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setIsAuthenticated(true);
    setToken(accessToken);
    await fetchUserData(accessToken);
  };

  const signup = async (email, password, userData) => {
    try {
      console.log('Attempting registration with:', { email, userData });
      
      const response = await axios.post('http://127.0.0.1:8000/api/users/register/', {
        email,
        password,
        password2: password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.access && response.data.refresh) {
        await login(response.data.access, response.data.refresh);
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.data?.password) {
        throw new Error(error.response.data.password[0]);
      } else if (error.response?.data?.email) {
        throw new Error(error.response.data.email[0]);
      } else if (error.response?.data?.non_field_errors) {
        throw new Error(error.response.data.non_field_errors[0]);
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.message === 'Network Error') {
        throw new Error('Cannot connect to the server. Please make sure the backend server is running.');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, signup, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 