import express from 'express';
import authController from '../controllers/auth.controller.js';
import mailerController from '../controllers/mailer.controller.js';
import jwtAuthMiddleware from '../middleware/jwt-auth.middleware.js';

const authRoutes = express.Router();


authRoutes
    .post('/login',authController.login)
    .post('/verify-otp',mailerController.optVerify)
    .post('/signup',authController.register)
    .post('/resend-otp',mailerController.resendOtp)
    .get('/get-profile',jwtAuthMiddleware,authController.getProfile)


export default authRoutes;