
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {connectDB,connectCloudinary} from './config/config.js'
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

//App Config
const app = express()
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//Middlewares
app.use(cors());
app.use(express.json());

//app endpoints
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/',(req,res) => {
    res.send("API is running");
})

app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));