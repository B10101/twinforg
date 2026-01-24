import React from 'react'
import { front } from '../assets/assets'


const HeroAbt = () => {
  return (
    <div className='border border-gray-100 m-2 sm:m-8 rounded-xl shadow-lg'>
      {/* Text section at top */}
      <div className='px-10 py-10 bg-gray-50'>
        <div className='flex items-center justify-center gap-2'>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
          <p className='prata-regular font-medium text-sm md:text-base text-[#414141]'>About</p>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
        </div>
        <h1 className='prata-regular text-3xl sm:py-3 md:text-5xl font-bold pt-5 leading-relaxed text-[#414141] text-center'>Layered</h1>
        <div className='flex items-center justify-center gap-2'>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
          <p className='font-semibold text-sm md:text-base text-[#414141]'>Kenya</p>
          <p className='w-8 md:w-12 h-[2px] bg-[#414141]'></p>
        </div>
      </div>

      {/* Image section below */}
      <div className='flex justify-center items-start'>
        <img
          src={front}
          alt="hero image"
          className='w-1/2 sm:w-2/3 md:w-1/2 max-h-240 object-contain rotate-270'
        />
      </div>
    </div>
  )
}

export default HeroAbt