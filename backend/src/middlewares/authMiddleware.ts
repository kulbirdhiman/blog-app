import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    console.log(req.cookies , "this is cokkie")
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized – No token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;
    (req as any).user = decoded; // { id, email }
    console.log((req as any).user)

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
