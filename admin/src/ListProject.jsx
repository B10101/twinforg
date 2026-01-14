// FILE: admin/src/pages/ListProjects.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const ListProjects = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/project/list');
      if (response.data.success) {
        setList(response.data.projects);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProject = async (id) => {
    try {
      const response = await axios.delete(backendUrl + `/api/project/delete/${id}`, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='mb-2 text-lg font-semibold'>All Projects List</p>
      <div className='flex flex-col gap-2'>
        {/* List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Title</b>
          <b>Category</b>
          <b>Featured</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Project List */}
        {list.map((item, index) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
            <img className='w-12 h-12 object-cover rounded' src={item.image[0]} alt="" />
            <div>
              <p className='font-medium'>{item.title}</p>
              <p className='text-xs text-gray-500 mt-1 line-clamp-2'>{item.description}</p>
            </div>
            <p className='capitalize'>{item.category}</p>
            <p className='md:block hidden'>
              {item.featured ? (
                <span className='text-green-600 font-medium'>★ Featured</span>
              ) : (
                <span className='text-gray-400'>-</span>
              )}
            </p>
            <div className='flex justify-center'>
              <button
                onClick={() => removeProject(item._id)}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-xs'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProjects;