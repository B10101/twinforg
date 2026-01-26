import React, { useState, useContext } from 'react'
import { logo, profile, search_icon, cart, menu, back, twinforge_icon } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom' 
import { ShopContext } from '../context/ShopContext'
import FlipLink from './FlipLink'


const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const {setShowSearch, getCartCount, navigate, token, setToken,setCartItems} = useContext(ShopContext);
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
        navigate('/login');
    }

  return (
    <div className='flex flex-items-center justify-between py-5 font-medium'>
        <Link to='/'><img src={twinforge_icon} className='w-16 rounded-xl drop-shadow' alt="" /></Link>
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700 pt-10'>
            <FlipLink to='/' className='flex flex-col items-center gap-1'>
                <p> HOME </p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </FlipLink>
            <FlipLink  to='/about' className='flex flex-col items-center gap-2'>
                <p> ABOUT </p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </FlipLink >
            <FlipLink to='/portfolio' className='flex flex-col items-center gap-2'>
                <p> PORTFOLIO </p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </FlipLink >

            <FlipLink  to='/collection' className='flex flex-col items-center gap-2'>
                <p> LUME</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </FlipLink >
            <FlipLink  to='/tinkertronics' className='flex flex-col items-center gap-2'>
                <p> TINKERTRONICS</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </FlipLink >
            

            <FlipLink to='/contact' className='flex flex-col items-center gap-2'>
                <p> CONTACT </p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </FlipLink>        
        </ul>

        <div className='flex items-center gap-6 pt-7'>
            <div className='group relative'>
                <img 
                    onClick={() => {
                        if (token) {
                            setShowProfileMenu(!showProfileMenu);
                        } else {
                            navigate('/login');
                        }
                    }} 
                    className='w-6 cursor-pointer' 
                    src={profile} 
                    alt="" 
                /> 
                {/* dropdown menu - desktop */}
                {token && (
                    <div className='hidden sm:group-hover:block absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                            <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                        </div>
                    </div>
                )}
                
                {/* dropdown menu - mobile */}
                {token && showProfileMenu && (
                    <div className='sm:hidden absolute dropdown-menu right-0 pt-4 z-50'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <p onClick={() => { navigate('/orders'); setShowProfileMenu(false); }} className='cursor-pointer hover:text-black'>Orders</p>
                            <p onClick={() => { logout(); setShowProfileMenu(false); }} className='cursor-pointer hover:text-black'>Logout</p>
                        </div>
                    </div>
                )}
            </div>

            <Link to='/cart' className='relative'>
                <img src={cart} className='w-6 cursor-pointer min-w-5'  alt="" />
                <p className='absolute right-[-4px] bottom-[-4px] w-4 text-center leading-4 text-white bg-black aspect-square rounded-full text-[8px] '>{getCartCount()}</p>
            </Link>
            <img onClick={()=>setVisible(!visible)} src={ menu } className='w-6 cursor-pointer sm:hidden' alt="" />
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden transition ease-in-out duration-300 z-[60] ${visible ? 'w-1/2' : 'w-0' }`} style={{backgroundColor: '#F1F5FD'}}>
                <div className='flex flex-col text-gray-600 p-3 pt-15'>
                    <div onClick={()=>setVisible(!visible)} className='flex items-center gap-4 cursor-pointer p-3'>
                        <img src={back} className='w-5' alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={()=>setVisible(!visible)} to='/' className='flex flex-col items-center gap-1 py-5'>HOME</NavLink>
                    <NavLink onClick={()=>setVisible(!visible)} to='/about' className='flex flex-col items-center gap-1 py-5'>ABOUT</NavLink>
                    <NavLink onClick={()=>setVisible(!visible)} to='/portfolio' className='flex flex-col items-center gap-1 py-5'>PORTFOLIO</NavLink>
                    <NavLink onClick={()=>setVisible(!visible)} to='/collection' className='flex flex-col items-center gap-1 py-5'>LUME</NavLink>
                    <NavLink onClick={()=>setVisible(!visible)} to='/tinkertronics' className='flex flex-col items-center gap-1 py-5'>TINKERTRONICS</NavLink>                    
                    <NavLink onClick={()=>setVisible(!visible)} to='/contact' className='flex flex-col items-center gap-1 py-5'>CONTACT</NavLink>
                </div>
            </div>

        </div>
        

    </div>
  )
}

export default Navbar