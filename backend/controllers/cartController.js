import userModel from '../models/userModel.js'
// Add to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        if (!userId || !productId) {
            return res.status(400).json({ message: "Missing userId or productId" });
        }

        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        let cartData = { ...userData.cartData };
        
        if (cartData[productId]) {
            cartData[productId] += 1;
        } else {
            cartData[productId] = 1;
        }

        // Use markModified to ensure Mongoose detects the change
        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        
        console.log('Updated cartData:', cartData);
        
        res.status(200).json({ message: "Product added to cart", cartData });
    } catch (error) {
        console.log('Error in addToCart:', error);
        res.status(400).json({ message: error.message });
    }
}

// update cart
const updateCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let cartData = { ...userData.cartData }; // Remove 'await' and add spread
        
        if (quantity === 0) {
            // Remove the item from cart if quantity is 0
            delete cartData[productId];
        } else {
            cartData[productId] = quantity;
        }
        
        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        
        console.log('Updated cartData:', cartData);
        
        res.status(200).json({ message: "Cart updated successfully", cartData });
    } catch (error) {
        console.log('Error in updateCart:', error);
        res.status(400).json({ message: error.message });
    }
}

// get cart items
const getCart  = async (req, res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData
        res.status(200).json({cartData})
    } catch (error) {
        res.status(400).json({message:error.message}) 
    }
}

export {
    addToCart,
    updateCart,
    getCart
}