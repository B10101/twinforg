import React, { use, useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { star, star_dull } from '../assets/assets';
import { RelatedProducts} from '../components';

const Product = () => {
  const {id} = useParams();
  const {all_product, currency, addToCart} = useContext(ShopContext);
  const [product, setProduct] = useState(false);
  const[image,setImage ] = useState('')

  const fetchProduct = async () =>{
    all_product.map((item)=>{
      
      
      if(String(item._id) === String(id)){
        setProduct(item);
        setImage(item.image[0])
        return null;
      }    

    })
  }
  useEffect(() => {
    fetchProduct();
  }, [id, all_product])
  
  return product ? (
    <div className='pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              product.image.map((item,index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer h-auto rounded-xl' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto rounded-xl' alt="" />
            <div className='absolute inset-0 bg-[#DBE4F6] opacity-20 rounded-lg pointer-events-none'></div>
          </div>  
        </div>  

        {/* Product Details */}
        <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{product.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={star} className='w-3 5' alt="star icon" />
              <img src={star} className='w-3 5' alt="star icon" />
              <img src={star} className='w-3 5' alt="star icon" />
              <img src={star} className='w-3 5' alt="star icon" />
              <img src={star_dull} className='w-3 5' alt="star icon" />
              <p className='pl-2'>(134)</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>{currency}{product.price}</p>
            <button onClick={() => addToCart(product._id)} className='bg-gray-700 text-white px-8 py-4 text-sm active:bg-black rounded'>ADD TO CART</button>
            <hr className='mt-8 sm:4-4/5'/>
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% original product</p>
            </div>            
        </div>
      </div>
      {/* Related products */}
      <RelatedProducts category={product.category} />
    </div>

  ) : <div className = 'opacity-0'></div>
}

export default Product