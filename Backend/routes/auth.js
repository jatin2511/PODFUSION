import express, { Router } from "express";
import { signup,signin, logout, googleAuthSignIn, generateOTP, verifyOTP, createResetSession,findUserByEmail, resetPassword } from "../controllers/auth.js";
import { localVariables } from "../middleware/auth.js";
import { configDotenv } from "dotenv";
configDotenv();

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", logout);

router.post("/google", googleAuthSignIn);


router.get("/findbyemail", findUserByEmail);

router.get("/generateotp",localVariables, generateOTP);


router.get("/verifyotp", verifyOTP);

router.get("/createResetSession", createResetSession);

router.put("/forgetpassword", resetPassword);




export default router;