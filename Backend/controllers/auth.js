import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();

// OAuth2 setup
const { OAuth2 } = google.auth;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Created a Nodemailer transporter using OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_FROM,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});
//signup
export const signup = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(422).send({ message: "Missing email or password." });
    }
  
    try {
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser) {
        return res.status(409).send({ message: "Email is already in use." });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = new User({ ...req.body, password: hashedPassword });
  
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "9999 years" });
      res.status(200).json({ token, user: newUser });
    } catch (err) {
      console.error('Error during signup:', err);
      next(createError(500, 'An unexpected error occurred'));
    }
  };

// Signin
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(201, "User not found"));
    }
    if (user.googleSignIn) {
      return next(createError(201, "Entered email is Signed Up with google account. Please SignIn with google."));
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return next(createError(201, "Wrong password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "9999 years" });
    res.status(200).json({ token, user });

  } catch (err) {
    next(err);
  }
}

// Google Auth SignIn
export const googleAuthSignIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      try {
        const newUser = new User({ ...req.body, googleSignIn: true });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "9999 years" });
        res.status(200).json({ token, user: newUser });
      } catch (err) {
        next(err);
      }
    } else if (user.googleSignIn) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "9999 years" });
      res.status(200).json({ token, user });
    } else if (user.googleSignIn === false) {
      return next(createError(201, "User already exists with this email can't do google auth"));
    }
  } catch (err) {
    next(err);
  }
}

// Logout
export const logout = (req, res) => {
  res.clearCookie("access_token").json({ message: "Logged out" });
}

// Send Email
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
};

// Generate OTP
export const generateOTP = async (req, res, next) => {
  req.app.locals.OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
  const { email, name, reason } = req.query;

  const verifyOtp = {
    to: email,
    subject: 'Account Verification OTP',
    text: `
      Dear ${name},
      
      Thank you for creating a PODFUSION account. To activate your account, please enter the following verification code:

      ${req.app.locals.OTP}

      Please enter this code in the PODFUSION app to activate your account.

      If you did not create a PODFUSION account, please disregard this email.

      Best regards,
      The PODFUSION Team
    `,
  };

  const resetPasswordOtp = {
    to: email,
    subject: 'PODFUSION Reset Password Verification',
    text: `
      Dear ${name},

      To reset your PODFUSION account password, please enter the following verification code:

      ${req.app.locals.OTP}

      Please enter this code in the PODFUSION app to reset your password.

      If you did not request a password reset, please disregard this email.

      Best regards,
      The PODFUSION Team
    `,
  };

  try {
    if (reason === "FORGOTPASSWORD") {
      await sendEmail(email, resetPasswordOtp.subject, resetPasswordOtp.text);
    } else {
      await sendEmail(email, verifyOtp.subject, verifyOtp.text);
    }
    return res.status(200).send({ message: "OTP sent" });
  } catch (err) {
    next(err);
  }
}

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  const { code } = req.query;
  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    res.status(200).send({ message: "OTP verified" });
  } else {
    return next(createError(201, "Wrong OTP"));
  }
}

// Create Reset Session
export const createResetSession = async (req, res, next) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).send({ message: "Access granted" });
  }

  return res.status(400).send({ message: "Session expired" });
}

// Find User By Email
export const findUserByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).send({ message: "User found" });
    } else {
      return res.status(202).send({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
}

// Reset Password
export const resetPassword = async (req, res, next) => {
  if (!req.app.locals.resetSession) return res.status(440).send({ message: "Session expired" });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      await User.updateOne({ email }, { $set: { password: hashedPassword } });
      req.app.locals.resetSession = false;
      return res.status(200).send({ message: "Password reset successful" });
    } else {
      return res.status(202).send({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
}