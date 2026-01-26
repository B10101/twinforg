import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { CartTotal, Title } from '../components';
import { bin } from '../assets/assets';
import { toast } from 'react-toastify';
import transition from '../transition';


const Cart = () => {
  
  const { all_product, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext); 
  const [cartData, setCartData] = useState([]);
 
  const handleCheckout = () => {
  if (cartData.length === 0) {
    toast.error('Your cart is empty. Add items before checkout.');
    return;
  }
  navigate('/placeorder');
};


  useEffect(() => {
    if (all_product.length > 0) {
      const tempData = [];
      for (const id in cartItems) {
        const qty = cartItems[id];
        if (qty > 0) {
          tempData.push({
            id: id, // Keep as string, don't convert to Number
            quantity: cartItems[id]
          });
        }
    }  
    setCartData(tempData);  
    }
    
  }, [cartItems, all_product]);

  return (
    <div className=' pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {cartData.map((item, index) => {
          
          const product = all_product.find(p => p._id === item.id);
          if (!product) return null;
          
          return (
            <div
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
              key={index}
            >
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20 rounded-xl' src={product.image[0]} alt="" />
                <div>
                  <p className='text-sm sm:text-lg font-medium'>{product.name}</p>
                  <div className='flex items-center mt-2 gap-5'>
                    <p>{currency}{product.price}</p>
                  </div>
                </div>
              </div>
              <input
                className='border border-gray-400 rounded-lg max-w-10 sm:max-w-20 px-1 py-1 sm:px-2'
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              />
              <img
                onClick={() => updateQuantity(item.id, 0)}
                className='w-4 mr-4 sm:w-5 cursor-pointer'
                src={bin}
                alt="bin"
              />
            </div>
          );
        })}
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button  onClick={handleCheckout} className='bg-gray-800 text-white text-sm my-8 px-8 py-3 rounded-xl drop-shadow-lg cursor-pointer'>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default transition(Cart)