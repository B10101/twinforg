import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { product_cart } from '../assets/assets'


const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/updateOrderStatus`,
        {
          orderId,
          status: e.target.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        toast.success(response.data.message);
        await fetchAllOrders()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed')
      console.log(error.message);
      
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <h3>Orders Page</h3>
      <div>
        {
          orders.map((order) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-600' key={order._id}>
              <img className='w-12' src={product_cart} alt="" />
              
                <div>
                  {
                    order.products.map((item) => (
                      <div key={item._id}>
                        <p className='py-0.5'>Product Name: {item.name}</p>
                        <p className='py-0.5'>Price: {item.price}</p>
                        <p className='py-0.5'>Quantity: {item.quantity}</p>
                      </div>
                    ))
                  }
                  
                  <p className='mt-3 mb-2 font-medium' >Client Name: {order.address.firstname + " " + order.address.lastname}</p>
                  <div>
                    <p> County: {order.address.county}</p>
                    <p>Town: {order.address.town}</p>
                  
                  <p>Phone Number: {order.address.phone}</p>
                  <p>Email: {order.address.email}</p>
                  </div>
                </div>
                <div>
                  <p className='text-sm'>Amount: {currency}{order.amount}</p>
                  <p className='mt-3'>{order.paymentStatus? "Paid" : "Unpaid"}</p>
                  <p>{order.paymentMethod}</p>
                  <p>{order.date}</p>
                </div>
                
                <select onChange={(e) =>statusHandler(e,order._id)} value={order.status} className='p-2 font-bold'>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Order Shipped">Order Shipped</option>
                  <option value="Order Delivered">Order Delivered</option>
                  <option value="Order Cancelled">Order Cancelled</option>
                </select>
              </div>

            
          ))
        }
      </div>
    </div>
  )
}

export default Orders