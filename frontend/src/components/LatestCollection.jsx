import React from 'react'
import { Link } from 'react-router-dom'
import { Title } from './'
import { lume_pic, trinkets } from '../assets/assets'

const LatestCollection = () => {
  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'WHAT WE'} text2={'DO'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4'>
          We offer innovative solutions across two distinct categories, each designed to enhance your experience and meet your unique needs.
        </p>
      </div>

      {/* Lume Section - Image on Right */}
      <div className='flex flex-col md:flex-row gap-8 items-center my-16 px-4 sm:px-8'>
        {/* Text on Left */}
        <div className='w-full md:w-1/2'>
          <h2 className='text-2xl sm:text-3xl font-bold text-[#414141] mb-4'>Lume</h2>
          <p className='text-gray-600 text-sm sm:text-base mb-6 leading-relaxed'>
            Discover our Lume collection featuring premium products designed to illuminate your space. 
            From elegant lighting solutions to innovative designs, Lume brings brightness and style 
            to every corner of your life.
          </p>
          <Link to='/collection'>
            <button className='bg-[#2B457D] text-white px-8 py-3 text-sm sm:text-base hover:bg-gray-700 transition-colors rounded-md drop-shadow-lg'>
              Explore Lume
            </button>
          </Link>
        </div>
        {/* Image on Right */}
        <div className='w-full md:w-1/2 relative'>
          <img 
            src={lume_pic} 
            alt='Lume Collection' 
            className='w-full h-[300px] sm:h-[400px] object-cover rounded-lg drop-shadow-xl'
          />
          {/* Light overlay */}
          <div className='absolute inset-0 bg-[#DBE4F6] opacity-20 rounded-lg pointer-events-none'></div>
        </div>
      </div>

      {/* Tinkertronics Section - Image on Left */}
      <div className='flex flex-col md:flex-row-reverse gap-8 items-center my-16 px-4 sm:px-8'>
        {/* Text on Right */}
        <div className='w-full md:w-1/2'>
          <h2 className='text-2xl sm:text-3xl font-bold text-[#414141] mb-4'>Tinkertronics</h2>
          <p className='text-gray-600 text-sm sm:text-base mb-6 leading-relaxed'>
            Dive into the world of Tinkertronics, where technology meets creativity. 
            Our collection features cutting-edge electronics and innovative gadgets perfect 
            for makers, hobbyists, and tech enthusiasts.
          </p>
          <Link to='/tinkertronics'>
            <button className='bg-[#2B457D] text-white px-8 py-3 text-sm sm:text-base hover:bg-gray-700 transition-colors rounded-md drop-shadow-lg'>
              Explore Tinkertronics
            </button>
          </Link>
        </div>
        {/* Image on Left */}
        <div className='w-full md:w-1/2 relative'>
          <img 
            src={trinkets} 
            alt='Tinkertronics Collection' 
            className='w-full h-[300px] sm:h-[400px] object-cover rounded-xl drop-shadow-xl'
          />
          {/* Light overlay */}
          <div className='absolute inset-0 bg-[#DBE4F6] opacity-20 rounded-lg pointer-events-none'></div>
        </div>
      </div>
    </div>
  )
}

export default LatestCollection