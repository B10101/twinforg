import  orderModel  from "../models/orderModel.js"
import  userModel from "../models/userModel.js"
import PaystackModule from 'paystack-sdk';
import https from 'https';
import { initiatePayment } from '../services/kcbService.js';

const { default: Paystack } = PaystackModule;
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);





// orders using COD
const placeOrder = async(req,res) => {
    try {
        const { userId, products, amount, address } = req.body;
        const orderData = {
            userId,
            products,
            amount,
            address, 
            paymentMethod: "COD",
            paymentStatus: false,
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, {cartData:{}})
        res.status(200).json({message:"Order placed successfully"})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

// orders using Card
const placeOrderPaystack = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        // Validate required fields
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Get user data for email
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create order first
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Paystack",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Initialize Paystack payment
        const params = JSON.stringify({
            email: userData.email,
            amount: amount * 100, // Convert to kobo (smallest unit)
            currency: "KES", // or "NGN" for Nigeria
            metadata: {
                userId: userId,
                orderId: newOrder._id.toString(),
                custom_fields: [
                    {
                        display_name: "Order ID",
                        variable_name: "order_id",
                        value: newOrder._id.toString()
                    }
                ]
            },
            callback_url: `${origin}/verify-payment` // Redirect after payment
        });

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        // Make request to Paystack
        const paystackReq = https.request(options, (paystackRes) => {
            let data = '';

            paystackRes.on('data', (chunk) => {
                data += chunk;
            });

            paystackRes.on('end', () => {
                const response = JSON.parse(data);
                
                if (response.status) {
                    // Return payment URL to frontend
                    res.status(200).json({
                        success: true,
                        message: "Order created successfully",
                        orderId: newOrder._id,
                        authorizationUrl: response.data.authorization_url,
                        reference: response.data.reference
                    });
                } else {
                    // Payment initialization failed, delete order
                    orderModel.findByIdAndDelete(newOrder._id);
                    res.status(400).json({ 
                        success: false,
                        message: response.message || "Payment initialization failed" 
                    });
                }
            });
        });

        paystackReq.on('error', (error) => {
            console.error('Paystack Error:', error);
            // Delete order if payment initialization fails
            orderModel.findByIdAndDelete(newOrder._id);
            res.status(500).json({ 
                success: false,
                message: 'Payment initialization failed' 
            });
        });

        paystackReq.write(params);
        paystackReq.end();

    } catch (error) {
        console.log('Error in placeOrderPaystack:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Verify payment after redirect
const verifyPaystackPayment = async (req, res) => {
    try {
        const { reference } = req.body;

        if (!reference) {
            return res.status(400).json({ 
                success: false,
                message: "Payment reference is required" 
            });
        }

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        };

        const paystackReq = https.request(options, (paystackRes) => {
            let data = '';

            paystackRes.on('data', (chunk) => {
                data += chunk;
            });

            paystackRes.on('end', async () => {
                const response = JSON.parse(data);
                
                if (response.status && response.data.status === 'success') {
                    const { userId, orderId } = response.data.metadata;

                    // Update order payment status
                    await orderModel.findByIdAndUpdate(orderId, {
                        paymentStatus: true,
                        paymentReference: reference
                    });

                    // Clear user's cart
                    await userModel.findByIdAndUpdate(userId, { cartData: {} });

                    res.status(200).json({
                        success: true,
                        message: 'Payment verified successfully',
                        orderId: orderId
                    });
                } else {
                    await orderModel.findByIdAndDelete(orderId);
                    res.status(400).json({
                        success: false,
                        message: 'Payment verification failed',
                        
                    });
                }
            });
        });

        paystackReq.on('error', (error) => {
            console.error('Verification Error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Payment verification failed' 
            });
        });

        paystackReq.end();

    } catch (error) {
        console.log('Error in verifyPaystackPayment:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};


// orders using mpesa
const placeOrderKCB = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        // Validate required fields
        if (!userId || !items || !amount || !address || !address.phone) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        // Get user data
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Create order first
        const orderData = {
            userId,
            items, // Make sure you're using 'items' not 'products'
            amount,
            address,
            paymentMethod: "KCB M-Pesa",
            paymentStatus: false, // Changed from 'payment' to 'paymentStatus'
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        console.log('Order created:', newOrder._id);

        // Set callback URL
        const callbackUrl = process.env.NODE_ENV === 'production' 
            ? `${req.headers.origin}/api/order/kcb-callback`
            : `https://a32d240ddc08.ngrok-free.app/api/order/kcb-callback`;

        console.log('Callback URL:', callbackUrl);

        // Initiate KCB STK Push
        const kcbResponse = await initiatePayment({
            phoneNumber: address.phone,
            amount: amount,
            transactionDesc: `Order ${newOrder._id.toString().slice(-8)}`,
            callbackUrl: callbackUrl
        });

        console.log('KCB Response:', kcbResponse);

        // Check if STK push was successful
        if (kcbResponse.header?.statusCode === '0' || kcbResponse.response?.ResponseCode === '0') {
            // IMPORTANT: Store the CheckoutRequestID as transactionId
            const checkoutRequestID = kcbResponse.response.CheckoutRequestID;
            
            await orderModel.findByIdAndUpdate(newOrder._id, {
                transactionId: checkoutRequestID // Save this!
            });

            console.log('✅ TransactionId saved:', checkoutRequestID);

            res.status(200).json({
                success: true,
                message: "STK Push sent. Please check your phone",
                orderId: newOrder._id,
                checkoutRequestID: checkoutRequestID,
                customerMessage: kcbResponse.response.CustomerMessage
            });
        } else {
            // Payment initiation failed, delete order
            await orderModel.findByIdAndDelete(newOrder._id);
            
            res.status(400).json({
                success: false,
                message: kcbResponse.header?.statusDescription || 
                         kcbResponse.response?.ResponseDescription || 
                         "Failed to initiate payment"
            });
        }

    } catch (error) {
        console.log('Error in placeOrderKCB:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// KCB Callback handler

const kcbCallback = async (req, res) => {
    console.log('=== KCB CALLBACK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Body:', JSON.stringify(req.body, null, 2));

    try {
        const callbackData = req.body;

        // Handle the nested structure properly
        const stkCallback = callbackData.Body?.stkCallback;
        
        if (!stkCallback) {
            console.log('❌ Invalid callback structure');
            return res.status(200).json({ 
                ResultCode: 0,
                ResultDesc: "Invalid callback structure" 
            });
        }

        const resultCode = stkCallback.ResultCode;
        const resultDesc = stkCallback.ResultDesc;
        const checkoutRequestID = stkCallback.CheckoutRequestID;

        console.log('Result Code:', resultCode);
        console.log('Result Description:', resultDesc);
        console.log('Checkout Request ID:', checkoutRequestID);

        // ✅ Check if payment was successful (ResultCode 0 means success)
        if (resultCode === 0) {
            // Payment successful - UPDATE order
            console.log('✅ Payment successful');

            const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
            let mpesaReceiptNumber = '';
            let transactionDate = '';
            let phoneNumber = '';
            let amount = '';

            callbackMetadata.forEach(item => {
                if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = item.Value;
                if (item.Name === 'TransactionDate') transactionDate = item.Value;
                if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
                if (item.Name === 'Amount') amount = item.Value;
            });

            const order = await orderModel.findOne({ 
                transactionId: checkoutRequestID 
            });

            if (order) {
                if (!order.paymentStatus) {
                    await orderModel.findByIdAndUpdate(
                        order._id, 
                        {
                            paymentStatus: true,
                            paymentReference: mpesaReceiptNumber,
                            status: 'Payment Confirmed'
                        },
                        { new: true }
                    );

                    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
                    console.log('✅ Cart cleared for user:', order.userId);
                } else {
                    console.log('⚠️ Order already marked as paid');
                }
            }
        } else {
            // ❌ Payment failed or cancelled - DELETE THE ORDER HERE ⬇️⬇️⬇️
            console.log('❌ Payment failed/cancelled:', resultDesc);
            console.log('❌ Result Code:', resultCode);

            const order = await orderModel.findOne({ 
                transactionId: checkoutRequestID 
            });

            if (order) {
                // 🗑️ THIS IS WHERE THE DELETION HAPPENS
                await orderModel.findByIdAndDelete(order._id);
                console.log('🗑️ Order DELETED:', order._id);
            } else {
                console.log('⚠️ Order not found to delete');
            }
        }

        // Always respond with success to acknowledge callback
        res.status(200).json({ 
            ResultCode: 0,
            ResultDesc: "Callback received successfully" 
        });

    } catch (error) {
        console.error('❌ KCB Callback Error:', error);
        console.error('Stack:', error.stack);
        res.status(200).json({ 
            ResultCode: 0,
            ResultDesc: "Callback processed with errors" 
        });
    }
};

const checkKCBPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ 
                success: false,
                message: "Order ID is required" 
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Order not found" 
            });
        }

        res.status(200).json({
            success: true,
            payment: order.paymentStatus,
            status: order.status,
            paymentReference: order.paymentReference
        });

    } catch (error) {
        console.log('Error checking payment status:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};



// All orders for admin
const allOrders = async(req,res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).json({orders})
    } catch (error) {
        
    }
}

// User orders
const userOrders = async(req,res) => {
    try {
        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.status(200).json({orders})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}


// update order status from admin panel
const updateOrderStatus = async(req,res) => {
    try {
        const {orderId,status} = req.body
        await orderModel.findByIdAndUpdate(orderId,{status})
        res.status(200).json({message:"Order status updated successfully"})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export {placeOrder,placeOrderPaystack,verifyPaystackPayment,allOrders,userOrders,updateOrderStatus,placeOrderKCB, kcbCallback, checkKCBPaymentStatus}