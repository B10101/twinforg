import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'KES '

const App = () => {
  // Initialize token from localStorage, if present
  const [token, setToken] = useState(localStorage.getItem('token') || "");

  // Function to set token after login and store in localStorage
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // Function to logout and clear token
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem('token');
  };

  return (
    <div className="bg-gray-100 min-h-screen" style={{backgroundColor: '#DBE4F6'}}>
      <ToastContainer />
      {token ? (
        <>
          <Navbar setToken={handleLogout} />
          <hr className="border-gray-200" />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login setToken={handleLogin} />
      )}
    </div>
  );
};

export default App;
