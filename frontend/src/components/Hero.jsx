import React from 'react'
import { Heroimg } from '../assets/assets'

const Hero = () => {
  return (
    <div className='border border-gray-100 m-4 sm:m-8 rounded-xl shadow-lg'>
      {/* Text section at top */}
      <div className='px-10 py-10 bg-gray-50'>
        <div className='flex items-center justify-center gap-2'>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
          <p className='prata-regular font-medium text-sm md:text-base text-[#414141]'>WELCOME TO</p>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
        </div>
        <h1 className='prata-regular text-3xl sm:py-3 md:text-5xl font-bold pt-5 leading-relaxed text-[#414141] text-center'>Twinforge Technologies</h1>
        <div className='flex items-center justify-center gap-2'>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
          <p className='font-semibold text-sm md:text-base text-[#414141]'>LTD</p>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
        </div>
      </div>
      
      {/* Image section below */}
      <div className='flex justify-center items-center p-4 sm:p-8'>
        <img 
          src={Heroimg} 
          alt="hero image" 
          className='w-3/4 sm:w-2/3 md:w-1/2 object-contain'
        />
      </div>
    </div>
  )
}

export default Hero