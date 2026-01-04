import express from "express";
import { createUser, getAllUser, loginUser } from "../controllers/user.controller";
const router = express.Router();

router.route("/").post(createUser).get(getAllUser)
router.route("/login").post(loginUser)

export default router