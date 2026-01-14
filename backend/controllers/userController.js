import validator from 'validator';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ 
                success: false, 
                message: "Google credential is required" 
            });
        }

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        console.log('Google user:', { googleId, email, name });

        // Check if user exists
        let user = await userModel.findOne({ email });

        if (user) {
            // User exists - update Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.avatar = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = new userModel({
                name,
                email,
                googleId,
                avatar: picture,
                cartData: {}
            });
            await user.save();
        }

        // Create JWT token
        const token = createToken(user._id);

        res.status(200).json({ 
            success: true, 
            token,
            message: "Login successful" 
        });

    } catch (error) {
        console.log('Error in googleLogin:', error);
        res.status(500).json({ 
            success: false, 
            message: "Google authentication failed" 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User does not exist" 
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                success: false, 
                message: "Incorrect password" 
            });
        }

        const token = createToken(user._id);
        
        // Optional: Set cookie if you want to use it
        res.cookie("jwt", token, { httpOnly: true, maxAge: 24*60*60*1000 });
        
        res.status(200).json({ 
            success: true, 
            token, 
            message: "Login successful" 
        });
        
    } catch (error) {
        console.log('Error in loginUser:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // User existence check
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Validating user email format and password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format" 
            });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ 
                success: false, 
                message: "Password is not strong enough" 
            });
        }

        // Hashing password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = new userModel({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        await user.save();

        const token = createToken(user._id);
        
        res.status(200).json({ 
            success: true, 
            token, 
            message: "User registered successfully" 
        });
        
    } catch (error) {  
        console.log('Error in registerUser:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Create new admin (only accessible by existing admin)
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format" 
            });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ 
                success: false, 
                message: "Password is not strong enough" 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create admin user
        const admin = new userModel({ 
            name, 
            email, 
            password: hashedPassword,
            isAdmin: true  // Set as admin
        });
        
        await admin.save();

        res.status(200).json({ 
            success: true, 
            message: "Admin created successfully",
            admin: {
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin
            }
        });
        
    } catch (error) {  
        console.log('Error in createAdmin:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Update user to admin
const makeUserAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "User promoted to admin successfully",
            user: {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
        
    } catch (error) {
        console.log('Error in makeUserAdmin:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if it's the main admin from env variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({ 
                success: true, 
                token, 
                message: "Admin logged in successfully" 
            });
        }

        // Otherwise, check database for admin users
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Check if user is admin
        if (!user.isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required." 
            });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const token = createToken(user._id);
        
        res.status(200).json({ 
            success: true, 
            token, 
            message: "Admin logged in successfully" 
        });

    } catch (error) {
        console.log('Error in adminLogin:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const listAdmins = async (req, res) => {
    try {
        const admins = await userModel.find({ isAdmin: true }).select('-password');
        
        res.status(200).json({ 
            success: true, 
            admins 
        });
        
    } catch (error) {
        console.log('Error in listAdmins:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

export { loginUser, registerUser, adminLogin, googleLogin, createAdmin, makeUserAdmin, listAdmins }