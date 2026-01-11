import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const relatedProducts = ({category}) => {
    const {all_product} = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() =>{
        if (all_product.length > 0){
            let productsCopy = all_product.slice();
            productsCopy = productsCopy.filter(item => item.category === category);
            setRelated(productsCopy);


            setRelated(productsCopy.slice(0,5));
            
        }
    },[all_product])

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'}/>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item,index) => (
          <ProductItem key={item._id} id={item._id} image={item.image[0]} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  )
}

export default relatedProducts