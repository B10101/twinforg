import React from 'react'
import { NavLink } from 'react-router-dom'
import { add } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className=' w-[24%] min-h-screen pr-8 bg-[#F1F5FD] rounded-2xl'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink className='flex items-center gap-3 border border-gray-300  px-3 py-2 rounded-lg' to={'/add'}>
          <img className='w-8 m-auto' src={add} alt="" />
          <p className='hidden md:block'>Add items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300  px-3 py-2 rounded-lg' to={'/list'}>
          <img className='w-8 m-auto' src={add} alt="" />
          <p className='hidden md:block'>List items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300  px-3 py-2 rounded-lg' to={'/orders'}>
          <img className='w-8 m-auto' src={add} alt="" />
          <p className='hidden md:block'>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar