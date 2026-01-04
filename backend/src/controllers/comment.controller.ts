import { Request, Response } from "express";
import Comment from "../models/comment.model";
import Post from "../models/post.model";

// Create a comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, postId } = req.body;
    const userId = (req as any).user.id;

    if (!content || !postId) {
      return res.status(400).json({ message: "Content and postId are required" });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({ content, userId, postId });

    res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all comments for a post
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      include: [{ association: "author", attributes: ["id", "username", "email"] }],
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a comment (only author)
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.destroy();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
