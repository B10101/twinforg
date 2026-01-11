import express from 'express'
import { placeOrder, placeOrderPaystack,placeOrderKCB,kcbCallback,checkKCBPaymentStatus,allOrders,updateOrderStatus,userOrders,verifyPaystackPayment } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

//Admin features
orderRouter.post("/updateOrderStatus",adminAuth, updateOrderStatus);
orderRouter.post("/list", adminAuth , allOrders);


// payment features 
orderRouter.post("/placeOrder",authUser, placeOrder);
orderRouter.post("/place-paystack",authUser, placeOrderPaystack);
orderRouter.post('/verify-payment', verifyPaystackPayment);
orderRouter.post('/place-kcb', authUser, placeOrderKCB);
orderRouter.post('/kcb-callback', kcbCallback); 
orderRouter.post('/check-payment-status', checkKCBPaymentStatus);

// verify payment


// user features
orderRouter.post("/userOrders",authUser, userOrders);

export default orderRouter

