import express from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Create comment
router.post("/", authMiddleware, createComment);

// Get all comments of a post
router.get("/post/:postId", getCommentsByPost);

// Delete comment
router.delete("/:id", authMiddleware, deleteComment);

export default router;
