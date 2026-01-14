import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import AddProject from './pages/AddProject';
import ListProjects from './pages/ListProjects';
import CreateAdmin from './pages/CreateAdmin';
import ListAdmins from './pages/ListAdmins';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'KES ';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || "");

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

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
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/add" replace />} />
                
                {/* Product routes */}
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                
                {/* Portfolio routes */}
                <Route path="/add-project" element={<AddProject token={token} />} />
                <Route path="/list-projects" element={<ListProjects token={token} />} />
                
                {/* Admin management routes */}
                <Route path="/create-admin" element={<CreateAdmin token={token} />} />
                <Route path="/list-admins" element={<ListAdmins token={token} />} />
                
                {/* Orders route */}
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