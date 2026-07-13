import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SocketProvider } from './context/SocketContext';
import App from './App';
import './index.css';
import axios from 'axios';
import { authSuccess, logoutUser } from './features/authSlice';

// Global Axios configuration
axios.defaults.withCredentials = true;

// Request interceptor: Inject Bearer token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Silent token refreshing on 401
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Only attempt refresh if we get a 401, it hasn't been retried, and it isn't the login/refresh route itself
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/api/auth/login') &&
      !originalRequest.url?.includes('/api/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('/api/auth/refresh');
        const { token, user } = res.data;
        
        // Save new credentials
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Sync Redux Store
        store.dispatch(authSuccess({ token, user }));
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        store.dispatch(logoutUser());
      }
    }
    return Promise.reject(error);
  }
);

import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
