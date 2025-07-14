import nodemailer from 'nodemailer';
import crypto from 'crypto';
import UserModel from '../model/user.model.js';
import jwt from 'jsonwebtoken';


const mailerController = {
  generateOtp: function () {
    return {
      otp: crypto.randomInt(100000, 999999).toString(),
      otpExpiry: new Date(Date.now() + 5 * 60000) // 5 minutes
    }
  },

  optVerify: async (req, res) => {

    // here "type" indicate the type of otp verification, whether it is for registration ,forgot password, resend otp verification or email verification
    const { otp, email } = req.body;



    // Check if OTP and email are provided
    const user = await UserModel.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found.",
        success: false
      });
    }

    // Check if the user has already verified their email
    if (user.otp != otp) {
      return res.status(400).json({
        error: "Invalid OTP",
        message: "The OTP provided is invalid.",
        success: false
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        error: "OTP Expired",
        message: "The OTP has expired. Please request a new one."
      });
    }

    // Clear the OTP and OTP expiry
    user.emailVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    // Save the user
    await user.save();

    // Send a welcome email

    const response = await mailerController.welcomeMailForUser(
      {
        receiverEmail: user.email,
        name: user.name,
        subject: 'Welcome to Organization',
      }
    );

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Failed to send welcome email"
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      message: "verification successful",
      token: token,
      success: true
    });
  },

  resendOtp: async (req, res) => {

    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "User not found."
      });
    }

    // Generate a new OTP
    const otpObject = mailerController.generateOtp();

    // Update the user
    user.otp = otpObject.otp;
    user.otpExpiry = otpObject.otpExpiry;

    // Save the user
    await user.save();

    const response = await mailerController.otpMailForUser(
      {
        receiverEmail: email,
        subject: 'Resnd OTP ',
        name: user.name,
        otpType: 'resend otp',
        otp: otpObject.otp
      }
    );

    if (response.success) {
      res.status(200).json({
        message: "OTP sent.Please check your email.",
        success: true,
      });
    }
    else {
      res.status(500).json({
        message: "Failed to send OTP email",
        success: false
      })
    }


  },

  welcomeMailForUser: async (emailReq) => {

    console.log(process.env.SERVICE)
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.MAIL_ID, // your Gmail address
        pass: process.env.MAIL_PASSWORD, // your Gmail password or app-specific password
      }
    });
    const { receiverEmail, name, subject } = emailReq;

    // HTML template with dynamic values for employee onboarding

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Dashboard!</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f2f6ff;
    }
    table {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #007bff, #00c3ff);
      color: #ffffff;
      padding: 40px 20px;
      text-align: center;
    }
    .header img {
      width: 64px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 32px 30px;
      color: #333333;
    }
    .content h2 {
      color: #007bff;
      font-size: 22px;
      margin-top: 0;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      background-color: #f8fbff;
      text-align: center;
      padding: 20px;
      color: #666666;
      font-size: 13px;
    }
    .footer a {
      color: #007bff;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      .content, .header, .footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body style="background: #f2f6ff;">
  <table>
    <tr>
      <td class="header">
        <h1>Welcome to Dashboard!</h1>
        <p>Your workspace starts here.</p>
      </td>
    </tr>
    <tr>
      <td class="content">
        <h2>Hi ${name || 'there'},</h2>
        <p>Thank you for signing up with us. We're excited to have you onboard!</p>
        <p>We'll keep in touch via your email: <strong>${receiverEmail || 'your email'}</strong>.</p>
        <p>Let’s get started.</p>
        <p>Best regards,<br><strong>The Dashboard Team</strong></p>
      </td>
    </tr>
    <tr>
      <td class="footer">
        <p>&copy; ${new Date().getFullYear()} Dashboard. All rights reserved.</p>
        <p>
          <a href="https://dashboard.com">www.dashboard.com</a> |
          <a href="mailto:support@dashboard.com">support@dashboard.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;


    // Define the email options
    const mailOptions = {
      from: `"from Dashboard Organization" <${process.env.DISPLAY_EMAIL}>`, // sender address
      to: receiverEmail, // list of receivers
      subject: subject, // Subject line
      html: html // HTML body
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return false;
      }
      console.log('Email sent: ' + info.response);
      
    });
    return true;

  },

  otpMailForUser: async (req) => {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.MAIL_ID, // your Gmail address
        pass: process.env.MAIL_PASSWORD, // your Gmail password or app-specific password
      },
    });
    const { receiverEmail, subject, otp, name, otpType } = req;

   const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f2f6ff;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: #007bff;
        padding: 60px 20px;
        text-align: center;
        color: white;
      }
      .header h1 {
        margin: 0;
        font-size: 30px;
      }
      .content {
        padding: 30px 20px;
        color: #333;
      }
      .otp {
        font-size: 28px;
        font-weight: bold;
        color: #007bff;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        background: #f1f5ff;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #555;
      }
      .button {
        display: inline-block;
        background: #007bff;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 8px;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Dashboard</h1>
        <p>Secure, Simple, and Fast</p>
      </div>
      <div class="content">
        <p>Hi <strong>${name || 'User'}</strong>,</p>
        <p>You're receiving this email for <strong> ${otpType}</strong>.</p>
        <p>Use the following OTP to proceed:</p>
        <div class="otp">${otp}</div>
        <p>This OTP will expire in 5 minutes. Please do not share it with anyone.</p>
        <p>If you didn’t request this, kindly ignore this email.</p>
      </div>
      <div class="footer">
        <p>Dashboard | Your Personal Management Tool</p>
        <p>Visit us at <a href="https://your-dashboard-link.com" style="color: #007bff;">dashboard.com</a></p>
      </div>
    </div>
  </body>
  </html>
`;


    const mailOptions = {
      from: `"From Dashboard Organization" <${process.env.DISPLAY_EMAIL}>`, // sender address
      to: receiverEmail, // recipient address
      subject: subject, // email subject
      html: html, // email body with the HTML template
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);

        return { success: false };
      }
    })

    return { success: true };

  },

}


export default mailerController;