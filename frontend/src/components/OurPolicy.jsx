import React from 'react'
import { Exchange } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center text-xs sm:text-sm md:text-base text-gray-600 pt-10 '>
        <div>
            <img src={Exchange} className='w-12 m-auto mb-5' alt="exchange" />
            <p className='font-semibold'>OUR EXHANGE POLICY</p>
            <p className='text-gray-400'>We offer hassle free exhange of our products</p>
        </div>
        <div>
            <img src={Exchange} className='w-12 m-auto mb-5' alt="exchange" />
            <p className='font-semibold'>OUR EXHANGE POLICY</p>
            <p className='text-gray-400'>We offer hassle free exhange of our products</p>
        </div>
        <div>
            <img src={Exchange} className='w-12 m-auto mb-5' alt="exchange" />
            <p className='font-semibold'>OUR EXHANGE POLICY</p>
            <p className='text-gray-400'>We offer hassle free exhange of our products</p>
        </div>
    </div>
  )
}

export default OurPolicy