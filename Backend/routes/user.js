import express from "express";
import { signup,signin, logout, googleAuthSignIn, generateOTP, verifyOTP, createResetSession,findUserByEmail, resetPassword } from "../controllers/auth.js";
import { localVariables } from "../middleware/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", logout);

router.post("/google", googleAuthSignIn);
router.get("/",verifyToken,(req,res)=>{
    res.send(req.user)
})

router.get("/findbyemail", findUserByEmail);

router.get("/generateotp",localVariables, generateOTP);

router.get("/verifyotp", verifyOTP);

router.get("/createResetSession", createResetSession);

router.put("/forgetpassword", resetPassword);




export default router;