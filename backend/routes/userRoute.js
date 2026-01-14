import express from 'express'
import { loginUser, registerUser,adminLogin, googleLogin, createAdmin, makeUserAdmin, listAdmins  } from "../controllers/userController.js"
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/adminLogin", adminLogin);
userRouter.post('/google-login', googleLogin);
userRouter.post('/create-admin', adminAuth, createAdmin);
userRouter.post('/make-admin', adminAuth, makeUserAdmin);
userRouter.get('/list-admins', adminAuth, listAdmins);

export default userRouter
