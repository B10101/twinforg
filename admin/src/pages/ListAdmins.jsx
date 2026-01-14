// FILE: admin/src/pages/ListAdmins.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const ListAdmins = ({ token }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/user/list-admins', {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.data.success) {
        setAdmins(response.data.admins);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <p className='text-gray-600'>Loading admins...</p>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Admin Users</h2>
        <p className='text-sm text-gray-600'>Total Admins: {admins.length}</p>
      </div>

      <div className='flex flex-col gap-3'>
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[0.5fr_2fr_2fr_1.5fr_1fr] items-center py-3 px-4 border bg-gray-100 text-sm font-semibold rounded-lg'>
          <span>#</span>
          <span>Name</span>
          <span>Email</span>
          <span>Created</span>
          <span>Status</span>
        </div>

        {/* Admin List */}
        {admins.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            No admin users found
          </div>
        ) : (
          admins.map((admin, index) => (
            <div 
              key={admin._id} 
              className='grid grid-cols-1 md:grid-cols-[0.5fr_2fr_2fr_1.5fr_1fr] items-center gap-3 py-4 px-4 border rounded-lg bg-white hover:shadow-md transition-shadow'
            >
              <span className='text-gray-600 font-medium md:block hidden'>{index + 1}</span>
              
              <div className='flex items-center gap-3'>
                {admin.avatar ? (
                  <img 
                    src={admin.avatar} 
                    alt={admin.name} 
                    className='w-10 h-10 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'>
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className='font-medium text-gray-800'>{admin.name}</span>
              </div>

              <span className='text-gray-600 text-sm break-all'>{admin.email}</span>

              <span className='text-gray-500 text-sm'>
                {new Date(admin.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>

              <div>
                <span className='inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                  Active Admin
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <h3 className='font-semibold text-yellow-800 mb-2'>⚠️ Important Notes:</h3>
        <ul className='text-sm text-yellow-700 space-y-1'>
          <li>• All admins have full access to the admin panel</li>
          <li>• Admins can create other admin accounts</li>
          <li>• There is no delete function to prevent accidental removal</li>
          <li>• Contact super admin to revoke admin access if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default ListAdmins;