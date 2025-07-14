import UserModel from "../model/user.model.js";
import mailerController from "./mailer.controller.js";

const authController = {
    login:async(req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required", success: false });
            }
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!user.emailVerified) {
                return res.status(200).json({ message: "email not verified, verify first",success: false });
            }

            const generatedOtp = mailerController.generateOtp();
            user.otp = generatedOtp.otp;
            user.otpExpiry = generatedOtp.otpExpiry;

            await user.save();
            const mailResponse = await mailerController.otpMailForUser({
                receiverEmail:user.email, subject:"Otp Verification", otp:user.otp, name:user.name, otpType:"login"
            });
            if (mailResponse.success) {
                return res.status(200).json({ message: "OTP sent to your email", success: true });
            } else {
                return res.status(500).json({ message: "Failed to send OTP email", success: false });
            }

        }catch(error){
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    register: async(req, res) => {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ message: "Name and email are required", success: false });
            }
            const existingUser = await UserModel.findOne({
                email: email.toLowerCase()
            });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists", success: false });
            }
            const newUser = new UserModel({
                name: name.trim(),
                email: email.toLowerCase()
            });

            const generatedOtp = mailerController.generateOtp();
            newUser.otp = generatedOtp.otp;
            newUser.otpExpiry = generatedOtp.otpExpiry;
            await newUser.save();

            const mailResponse = await mailerController.otpMailForUser({
                receiverEmail: newUser.email, subject: "Otp Verification", otp: newUser.otp, name: newUser.name, otpType: "signup"
            });
            if (!mailResponse.success) {
                await UserModel.deleteOne({ _id: newUser._id }); // Clean up if email sending fails
                return res.status(500).json({ message: "Failed to send OTP email", success: false });
            } 
            return res.status(201).json({success: true });

        } catch (error) {
            console.error("Error in register:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }
    },

    getProfile: async (req, res) => {
        try {
            const {userId} = req.user; // Assuming user ID is stored in req.user
            const user = await UserModel.findById(userId).select('-otp -otpExpiry -emailVerified');
            if (!user) {
                return res.status(404).json({ message: "User not found", success: false });
            }
            return res.status(200).json({ user, success: true });
        } catch (error) {
            console.error("Error in getProfile:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }
    }

}


export default authController;