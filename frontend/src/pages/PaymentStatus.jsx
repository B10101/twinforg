import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {check, close } from '../assets/assets';

const PaymentStatus = () => {
    const { orderId } = useParams();
    const { backendUrl, token, setCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const [status, setStatus] = useState('checking');
    const [countdown, setCountdown] = useState(60);
    
    // ✅ Use refs to store interval IDs so we can clear them anywhere
    const pollIntervalRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    useEffect(() => {
        // Check if user is logged in
        if (!token) {
            toast.error('Please log in to view payment status');
            navigate('/login');
            return;
        }

        if (!orderId) {
            navigate('/cart');
            return;
        }

        console.log('Token exists:', !!token);
        console.log('Order ID:', orderId);

        // Poll for payment status every 3 seconds
        pollIntervalRef.current = setInterval(() => {
            checkPaymentStatus();
        }, 3000);

        // Countdown timer
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(pollIntervalRef.current);
                    clearInterval(countdownIntervalRef.current);
                    setStatus('timeout');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(pollIntervalRef.current);
            clearInterval(countdownIntervalRef.current);
        };
    }, [orderId, token]);

    const checkPaymentStatus = async () => {
        if (!token) {
            console.log('No token available');
            return;
        }

        try {
            console.log('Checking payment status for order:', orderId);

            const response = await axios.post(
                backendUrl + '/api/order/check-payment-status',
                { orderId },
                { 
                    headers: { 
                        token: token,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            console.log('Payment status response:', response.data);

            if (response.data.success) {
                // Check if payment was successful
                if (response.data.payment) {
                    // ✅ Stop polling
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }
                    if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                    }
                    
                    setStatus('success');
                    setCartItems({});
                    toast.success('Payment successful!');
                    setTimeout(() => {
                        navigate('/orders');
                    }, 2000);
                } 
                // Check if payment failed
                else if (response.data.status === 'Payment Failed') {
                    // ✅ Stop polling when payment fails
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }
                    if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                    }
                    
                    setStatus('failed');
                    toast.error('Payment was cancelled or failed');
                }
            }
        } catch (error) {
            console.log('Error checking payment status:', error);
            console.log('Error response:', error.response?.data);
            console.log('Error status:', error.response?.status);
            
            // ✅ Handle 404 - order was deleted due to failed payment
            if (error.response?.status === 404) {
                console.log('Order deleted - payment failed');
                
                // ✅ IMPORTANT: Clear intervals BEFORE setting state
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                
                setStatus('failed');
                toast.error('Payment was cancelled or failed');
                return;
            }
            
            if (error.response?.status === 401) {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                
                toast.error('Session expired. Please log in again.');
                navigate('/login');
            }
        }
    };

    return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center max-w-md px-4'>
                {status === 'checking' && (
                    <>
                        <div className='inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600'></div>
                        <h2 className='mt-6 text-2xl font-semibold text-gray-800'>Waiting for Payment</h2>
                        <p className='mt-4 text-gray-600'>
                            Please complete the M-Pesa payment on your phone
                        </p>
                        <p className='mt-2 text-sm text-gray-500'>
                            Time remaining: {countdown}s
                        </p>
                        <div className='mt-6 p-4 bg-green-50 rounded-lg'>
                            <p className='text-sm text-gray-700'>
                                1. Check your phone for M-Pesa prompt<br/>
                                2. Enter your M-Pesa PIN<br/>
                                3. Wait for confirmation
                            </p>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className='inline-block h-16 w-16 rounded-full bg-red-100 flex items-center justify-center'>
                            <img src={check} alt="" />
                        </div>
                        <h2 className='mt-6 text-2xl font-semibold text-gray-800'>Payment Successful!</h2>
                        <p className='mt-4 text-gray-600'>Redirecting to your orders...</p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className='inline-block h-16 w-16 rounded-full bg-red-100 flex items-center justify-center'>
                            <img src={close} alt="" />
                        </div>
                        <h2 className='mt-6 text-2xl font-semibold text-gray-800'>Payment Failed</h2>
                        <p className='mt-4 text-gray-600'>
                            The payment was cancelled or failed. Please try again.
                        </p>
                        <div className='mt-6 flex gap-4 justify-center'>
                            <button 
                                onClick={() => navigate('/cart')}
                                className='bg-gray-700 text-white px-8 py-3 rounded-xl hover:bg-gray-800 cursor-pointer'
                            >
                                Back to Cart
                            </button>
                            <button 
                                onClick={() => navigate('/orders')}
                                className='bg-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-400 cursor-pointer'
                            >
                                View Orders
                            </button>
                        </div>
                    </>
                )}

                {status === 'timeout' && (
                    <>
                        <div className='inline-block h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center'>
                            <svg className='h-10 w-10 text-yellow-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                        <h2 className='mt-6 text-2xl font-semibold text-gray-800'>Payment Pending</h2>
                        <p className='mt-4 text-gray-600'>
                            We haven't received confirmation yet. Please check your M-Pesa messages.
                        </p>
                        <button 
                            onClick={() => navigate('/orders')}
                            className='mt-6 bg-gray-700 text-white px-8 py-3 rounded-xl hover:bg-gray-800'
                        >
                            View Orders
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;