import React from 'react'
import { instagram, logo, twinforge_icon } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom' 

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[1fr_1fr_1fr] gap-14 my-10 mt-40 text-sm items-center text-center'>
        {/* Links Section - Left */}
        <div>
          <p className=' text-xl font-medium mb-5 text-gray-800 text-right sm:text-center'>QUICK LINKS</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <NavLink to='/' className='flex flex-col items-center gap-1'>
                <p> HOME </p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-2'>
                <p> ABOUT </p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

            <NavLink to='/collection' className='flex flex-col items-center gap-2'>
                <p> LUME</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </NavLink>
            <NavLink to='/tinkertronics' className='flex flex-col items-center gap-2'>
                <p> TINKERTRONICS</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </NavLink>
            

            <NavLink to='/contact' className='flex flex-col items-center gap-2'>
                <p> CONTACT </p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
          </ul>
        </div>

        {/* Logo Section - Center */}
        <div className='flex flex-col items-center'>
          <img src={twinforge_icon} alt="Logo" className='mb-5 w-32 rounded-xl drop-shadow-lg' />
          <p className='text-center text-gray-600'>Twinforge Technologies</p>
          <p className='text-center text-gray-500 text-xs mt-2'>Innovating the Future</p>
        </div>

        {/* Socials Section - Right */}
        {/* Socials Section - Right */}
<div className='flex flex-col'>
  <p className='text-xl font-medium mb-5 text-gray-800'>FOLLOW US</p>
  <ul className='flex flex-col gap-2 text-gray-600'>
    <li>
      <a
        href="https://x.com/Twinforge_Tech"
        target="_blank"
        rel="noopener noreferrer"
        className='hover:text-gray-800'
      >
        Twitter
      </a>
    </li>
    <li>
      <a
        href="https://instagram.com/twinforge_tech"
        target="_blank"
        rel="noopener noreferrer"
        className='hover:text-gray-800'
      >
        Instagram
      </a>
    </li>
    <li>
      <a
        href="https://www.linkedin.com/company/twinforge-technologies/"
        target="_blank"
        rel="noopener noreferrer"
        className='hover:text-gray-800'
      >
        LinkedIn
      </a>
    </li>
  </ul>
</div>

      </div>
      
      <div>
        <hr className='border-gray-400' />
        <p className='py-5 text-sm text-center text-gray-600'>Copyright 2026 © Twinforge Technologies - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer