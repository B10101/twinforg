import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Handle both "Bearer <token>" and direct token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(" ")[1] 
      : authHeader;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's the main admin from env
    if (decoded.email === process.env.ADMIN_EMAIL) {
      return next();
    }
    
    // Check if it's an admin user from database
    if (decoded.id) {
      const user = await userModel.findById(decoded.id);
      
      if (user && user.isAdmin === true) {
        req.userId = user._id;
        return next();
      }
    }
    
    return res.status(401).json({ message: "Unauthorized - Admin access required" });
    
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default adminAuth;