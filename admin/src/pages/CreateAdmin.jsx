// FILE: admin/src/pages/CreateAdmin.jsx

import React, { useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateAdmin = ({ token }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/user/create-admin',
        { name, email, password },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='max-w-lg'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Create New Admin</h2>
      
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
        <div>
          <label className='block mb-2 text-sm font-medium text-gray-700'>Full Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            type="text"
            placeholder='Enter admin name'
            required
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-700'>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            type="email"
            placeholder='admin@example.com'
            required
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-700'>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            type="password"
            placeholder='Enter strong password'
            required
          />
          <p className='text-xs text-gray-500 mt-1'>
            Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)
          </p>
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-700'>Confirm Password</label>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            type="password"
            placeholder='Confirm password'
            required
          />
        </div>

        <button
          type='submit'
          className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium mt-2'
        >
          Create Admin
        </button>
      </form>

      <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <h3 className='font-semibold text-blue-800 mb-2'>Admin Privileges Include:</h3>
        <ul className='text-sm text-blue-700 space-y-1'>
          <li>• Add, edit, and delete products</li>
          <li>• Add, edit, and delete portfolio projects</li>
          <li>• Manage orders</li>
          <li>• Create new admins</li>
          <li>• Full access to admin panel</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateAdmin;