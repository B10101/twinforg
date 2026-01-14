import React from 'react'
import { NavLink } from 'react-router-dom'
import { add } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[24%] min-h-screen pr-8 bg-[#F1F5FD] rounded-2xl'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        
        {/* Products Section */}
        <div className='mb-2'>
          <p className='mb-3 font-bold text-gray-700 text-sm'>PRODUCTS</p>
          <div className='flex flex-col gap-3'>
            <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-lg hover:bg-white transition-colors' to={'/add'}>
              <img className='w-8 m-auto' src={add} alt="" />
              <p className='hidden md:block'>Add items</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-lg hover:bg-white transition-colors' to={'/list'}>
              <img className='w-8 m-auto' src={add} alt="" />
              <p className='hidden md:block'>List items</p>
            </NavLink>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className='mb-2'>
          <p className='mb-3 font-bold text-gray-700 text-sm'>PORTFOLIO</p>
          <div className='flex flex-col gap-3'>
            <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-lg hover:bg-white transition-colors' to={'/add-project'}>
              <img className='w-8 m-auto' src={add} alt="" />
              <p className='hidden md:block'>Add Project</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-lg hover:bg-white transition-colors' to={'/list-projects'}>
              <img className='w-8 m-auto' src={add} alt="" />
              <p className='hidden md:block'>List Projects</p>
            </NavLink>
          </div>
        </div>

        {/* Admin Management Section */}
        <div className='mb-2'>
          <p className='mb-3 font-bold text-gray-700 text-sm'>ADMIN MANAGEMENT</p>
          <div className='flex flex-col gap-3'>
            <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-lg hover:bg-white transition-colors' to={'/create-admin'}>
              <img className='w-8 m-auto' src={add} alt="" />
              <p className='hidden md:block'>Create Admin</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-lg hover:bg-white transition-colors' to={'/list-admins'}>
              <img className='w-8 m-auto' src={add} alt="" />
              <p className='hidden md:block'>List Admins</p>
            </NavLink>
          </div>
        </div>

        {/* Orders Section */}
        <div className='mb-2'>
          <p className='mb-3 font-bold text-gray-700 text-sm'>ORDERS</p>
          <div className='flex flex-col gap-3'>
            <NavLink className='flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-lg hover:bg-white transition-colors' to={'/orders'}>
              <img className='w-8 m-auto' src={add} alt="" />
              <p className='hidden md:block'>Orders</p>
            </NavLink>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Sidebar