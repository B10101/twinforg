import React from 'react'
import { Routes,Route } from 'react-router-dom'
import { Home,About,Contact,Login, Product, Collection, Cart, PlaceOrder, Orders, VerifyPayment,PaymentStatus, Tinkertronics} from './pages'
import { Footer, Navbar, Searchbar } from './components'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='min-h-screen flex flex-col' style={{backgroundColor: '#DBE4F6'}}>
      <ToastContainer/>
      <div className='sticky top-0 z-50' style={{backgroundColor: '#F1F5FD'}}>
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[10vw]'>
          <Navbar/>
          <Searchbar/>
        </div>
      </div>
      
      <div className='flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[10vw]'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/product/:id' element={<Product/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/placeorder' element={<PlaceOrder/>} />
          <Route path='/orders' element={<Orders/>} />
          <Route path='/collection' element={<Collection/>}/>
          <Route path='/tinkertronics' element={<Tinkertronics/>}/>
          <Route path='/verify-payment' element={<VerifyPayment />} />
          <Route path='/payment-status/:orderId' element={<PaymentStatus />} />
        </Routes>
        <Footer/>
      </div>
    </div>
  )
}

export default App