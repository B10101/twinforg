import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id, image, name, price}) => {
  const {currency} = useContext(ShopContext);
  
  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='w-2/3 shadow-md rounded-xl drop-shadow-xl'>
        <img className='w-full h-full object-cover rounded-xl transition ease-in duration-300 hover:opacity-80' src={image} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='pt-3 pb-1 text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem