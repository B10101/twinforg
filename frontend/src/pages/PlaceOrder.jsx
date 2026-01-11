import React, { useContext, useState } from 'react'
import { CartTotal, Title } from '../components'
import { card, cart, mpesaicon, stripe, visa } from '../assets/assets'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {

  const {navigate, backendUrl, cartItems, token, setCartItems, getCartAmount, delivery_fee, all_product} = useContext(ShopContext)
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    county: '',
    town: '',
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData( data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    try {
        let orderItems = [];
        
        // Loop through cartItems directly (it's a flat object)
        for(const productId in cartItems){
            const quantity = cartItems[productId];
            
            if(quantity > 0){
                const itemInfo = all_product.find(p => p._id === productId);
                
                if(itemInfo){
                    orderItems.push({
                        _id: itemInfo._id,
                        name: itemInfo.name,
                        price: itemInfo.price,
                        image: itemInfo.image[0],
                        quantity: quantity
                    });
                }
            }
        }
        
        console.log('Order Items to send:', orderItems);
        
        let orderData = {
          address: formData,
          items: orderItems, // Changed back to 'items' for consistency
          amount: getCartAmount() + delivery_fee,
        }
        
        switch (method) {
          case 'cod':
            const codResponse = await axios.post(
              backendUrl + '/api/order/placeOrder', 
              orderData, 
              { headers: { Authorization: `Bearer ${token}`} }
            )
            if(codResponse.status === 200){
              setCartItems({});
              toast.success(codResponse.data.message);
              navigate('/orders')
            } else {
              toast.error(codResponse.data.message);
            }
            break;

          case 'paystack':
            // Place order with Paystack
            const paystackResponse = await axios.post(
              backendUrl + '/api/order/place-paystack',
              orderData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if(paystackResponse.data.success){
              // Redirect to Paystack payment page
              window.location.href = paystackResponse.data.authorizationUrl;
            } else {
              toast.error(paystackResponse.data.message || 'Failed to initialize payment');
            }
            break;

          case 'mpesa':
            if (!formData.phone) {
                toast.error('Please enter your phone number');
                return;
            }

            toast.info('Initiating M-Pesa payment...');
            
            const mpesaResponse = await axios.post(
              backendUrl + '/api/order/place-kcb',
              orderData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if(mpesaResponse.data.success){
              toast.success(mpesaResponse.data.message);
              // Navigate to payment status page
              navigate(`/payment-status/${mpesaResponse.data.orderId}`);
            } else {
              toast.error(mpesaResponse.data.message);
            }
          break;

          

          default:
            break;
        }
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
}

  
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'ADDRESS'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstname' value={formData.firstname} className='border border-gray-300 rounded-xl py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastname' value={formData.lastname} className='border border-gray-300 rounded-xl py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded-xl py-1.5 px-3.5 w-full' type="email" placeholder='EMAIL ADDRESS' />
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded-xl py-1.5 px-3.5 w-full' type="tel" placeholder='PHONE NUMBER' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='county' value={formData.county} className='border border-gray-300 rounded-xl py-1.5 px-3.5 w-full' type="text" placeholder='COUNTY' />
          <input required onChange={onChangeHandler} name='town' value={formData.town} className='border border-gray-300 rounded-xl py-1.5 px-3.5 w-full' type="text" placeholder='TOWN' />
        </div>
      </div>
      {/* right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'OPTION'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=> setMethod('paystack')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paystack'? 'bg-green-400': ''}`}></p>
              <img className='h-10 mx-4' src={card} alt="card" />
            </div>
            <div onClick={()=> setMethod('mpesa')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'mpesa'? 'bg-green-400': ''}`}></p>
              <img className='h-10 mx-4' src={mpesaicon} alt="card" />
            </div>
            <div onClick={()=> setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod'? 'bg-green-400': ''}`}></p>
              <p className='flex items-center h-10 mx-4 text-gray-500 text-sm font-medium'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-gray-700 text-white px-16 py-3 rounded-xl cursor-pointer'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder