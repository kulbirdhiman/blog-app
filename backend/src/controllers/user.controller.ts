import { Request, Response } from "express";
import { Op, ValidationError } from "sequelize";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import setTokenCookie from "../utils/createtoken";


const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    // ✅ Validation
    if (!email || !username || !password) {
      res.status(400).json({
        message: "Email, username and password are required",
      });
      return;
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // ✅ Set JWT in cookie
    setTokenCookie(res, user.id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error: any) {
    // ✅ Sequelize validation error
    if (error instanceof ValidationError) {
      res.status(400).json({
        message: error.errors[0].message,
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    // ✅ Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // ✅ Set JWT in cookie
    setTokenCookie(res, user.id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const search = req.query.search as string | undefined;

    const offset = (page - 1) * limit;

    const whereCondition = search
      ? {
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { username: { [Op.like]: `%${search}%` } },
        ],
      }
      : {};

    const { rows, count } = await User.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      attributes: {
        exclude: ["password"], // 🔒 CRITICAL FIX
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      page,
      limit,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      users: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export { createUser, loginUser, getAllUser };
