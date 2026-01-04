import jwt from "jsonwebtoken";
import { Response } from "express";
const setTokenCookie = (res: Response, userId: Number) => {
    const token = jwt.sign(
        { id: userId },                 // ✅ send user ID
        (process.env.JWT_SECRET as string),
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,                 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token; // 
};

export default setTokenCookie;
