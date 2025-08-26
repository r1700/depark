// otp.sender.ts

import * as dotenv from 'dotenv';
const nodemailer = require('nodemailer');
import axios from 'axios';

// Load environment variables from .env file
dotenv.config();

// ----------------------------
// EMAIL SENDER (nodemailer)
// ----------------------------

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD, // Gmail App Password
  },
});

// Send OTP via email using HTML template
export async function sendOtpEmail(contact: string, otp: string) {
  console.log(`Sending OTP to email: ${contact} with OTP: ${otp}`);

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; background-color: #f9fbfc; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="../../../../images/Depark.png" alt="Depark Logo" style="max-width: 200px; height: auto;">
    </div>
    <h2 style="color: #4a90e2; text-align: center;">One-Time Verification Code</h2>
    <p style="text-align: center;">Your verification code is:</p>
    <h3 style="text-align: center; font-size: 36px;">${otp}</h3>
    <p style="text-align: center;">If you did not request this code, please disregard this email.</p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="#" style="background-color: #4a90e2; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none;">Verify Now</a>
    </div>
    <footer style="margin-top: 40px; text-align: center; font-size: 14px; color: #aaa;">
      <p>Thank you,<br/>The System Team</p>
    </footer>
  </div>
  `;

  try {
    const res = await transporter.sendMail({
      from: `"Depark - no replay" <${process.env.USER_EMAIL}>`,
      to: contact,
      subject: 'One-Time Verification Code',
      html: htmlContent,
    });

    return res;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

// ----------------------------
// SMS SENDER (via RapidAPI - D7)
// ----------------------------

export async function sendOtpSms(phoneNumber: string, otp: string) {
  const url = process.env.SMS_URL as string;

  const headers = {
    'x-rapidapi-key': process.env.X_RAOIDAPI_KEY,
    'x-rapidapi-host': process.env.X_RAOIDAPI_HOST,
    'Content-Type': 'application/json',
    Token: process.env.TOKEN_RAPID,
  };

  const payload = {
    messages: [
      {
        channel: 'sms',
        originator: 'Depark-code',
        recipients: [
          phoneNumber.startsWith('+') ? phoneNumber : `+972${phoneNumber.slice(1)}`,
        ],
        content: `Your verification code is: ${otp}`,
        data_coding: 'text',
      },
    ],
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('✅ SMS sent:', response.data);
    console.log(`SMS sent to ${phoneNumber} with OTP: ${otp}`);
    
    return response.status;
  } catch (error) {
    console.error('❌ Error sending SMS:', (error as any).response?.data || error);
    throw new Error('Failed to send SMS');
  }
}
