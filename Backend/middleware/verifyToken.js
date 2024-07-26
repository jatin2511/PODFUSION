import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization)  return next(createError(401, "You are not authenticated!"));
    
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token)  return next(createError(401, "You are not authenticated!"));

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    req.user = await User.findById(decode.id);
    next();
  } catch (error) {
    console.log(error)
    res.status(402).json({ error: error.message })
  }
};
