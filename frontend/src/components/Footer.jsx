import React from 'react'
import { instagram, logo, twinforge_icon } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import FlipLink from './FlipLink'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[1fr_1fr] gap-14 my-10 mt-40 text-sm items-center text-center'>
        {/* Links Section - Left */}
        <div>
          <p className=' text-xl font-medium mb-5 text-gray-800 text-right sm:text-center'>QUICK LINKS</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <FlipLink to='/' className='flex flex-col items-center gap-1' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <p> HOME </p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </FlipLink>
            <FlipLink to='/about' className='flex flex-col items-center gap-2' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <p> ABOUT </p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </FlipLink>

            <FlipLink to='/collection' className='flex flex-col items-center gap-2' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <p> LUME</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </FlipLink>

            <FlipLink to='/tinkertronics' className='flex flex-col items-center gap-2' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <p> TINKERTRONICS</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </FlipLink>


            <FlipLink to='/contact' className='flex flex-col items-center gap-2' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <p> CONTACT </p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </FlipLink>
          </ul>
        </div>

        {/* Logo Section - Center */}
        <div className='flex flex-col items-center'>
          <img src={twinforge_icon} alt="Logo" className='mb-5 w-32 rounded-xl drop-shadow-lg' />
          <p className='text-center text-gray-600'>By</p>
          <p className='text-center text-gray-600'>Twinforge Technologies</p>
          <p className='text-center text-gray-500 text-xs mt-2'>Innovating the Future</p>
        </div>      

      </div>
      <div className='flex flex-col items-center '>
          <p className='bitcount-single text-5xl mb-5 text-gray-700'>FOLLOW US</p>
          <ul className='flex flex-col gap-2 text-gray-600 text-3xl text-center'>
            <li>
              <FlipLink
                to="https://x.com/Twinforge_Tech"
                as="link"
                target="_blank"
                rel="noopener noreferrer"
                className='bitcount-single hover:text-gray-800'
              >
                X
              </FlipLink>
            </li>
            <li>
              <FlipLink
                to="https://instagram.com/twinforge_tech"
                as="link"
                target="_blank"
                rel="noopener noreferrer"
                className='bitcount-single hover:text-gray-800'
              >
                INSTAGRAM
              </FlipLink>
            </li>
            <li>
              <FlipLink
                to="https://www.linkedin.com/company/twinforge-technologies/"
                as="link"
                target="_blank"
                rel="noopener noreferrer"
                className='bitcount-single hover:text-gray-800'
              >
                LINKEDIN
              </FlipLink>
            </li>
          </ul>
        </div>
      <br />

      <div>
        <hr className='border-gray-400' />
        <p className='py-5 text-sm text-center text-gray-600'>Copyright 2026 © Twinforge Technologies - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer