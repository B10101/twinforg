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

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Sign token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return token to frontend
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

export { loginUser, registerUser, adminLogin, googleLogin }