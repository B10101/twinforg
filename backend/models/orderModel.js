import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    products: {type: Array, required: true},
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, default: 'Order Placed'},
    paymentMethod: {type: String, required: true},
    paymentStatus: {type: Boolean, required: true, default: false},
    paymentReference: { type: String },
    transactionId: { type: String }, 
    paymentError: { type: String },
    date: {type: Date, default: Date.now}
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel