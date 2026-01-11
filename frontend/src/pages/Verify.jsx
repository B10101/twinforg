import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyPayment = () => {
    const [searchParams] = useSearchParams();
    const { backendUrl, token, setCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const reference = searchParams.get('reference');
        
        if (reference) {
            verifyPayment(reference);
        } else {
            toast.error('Invalid payment reference');
            navigate('/cart');
        }
    }, []);

    const verifyPayment = async (reference) => {
        try {
            const response = await axios.post(
                backendUrl + '/api/order/verify-payment',
                { reference }
            );

            setVerifying(false);

            if (response.data.success) {
                setCartItems({});
                toast.success('Payment successful!');
                navigate('/orders');
            } else {
                toast.error('Payment verification failed');
                setTimeout(() => {
                    navigate('/cart');
                }, 2000);
            }
        } catch (error) {
            console.log(error);
            setVerifying(false);
            toast.error(error.response?.data?.message || 'Payment verification failed');
            setTimeout(() => {
                navigate('/cart');
            }, 2000);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center'>
                {verifying ? (
                    <>
                        <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                        <p className='mt-4 text-gray-600'>Verifying your payment...</p>
                    </>
                ) : (
                    <p className='text-gray-600'>Redirecting...</p>
                )}
            </div>
        </div>
    );
};

export default VerifyPayment;