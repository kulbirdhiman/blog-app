import { Request, Response } from "express";
import { Op } from "sequelize";
import Post from "../models/post.model";
import slugify from "slugify";

const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, published } = req.body;
        const userId = (req as any).user?.id;
        if (!title || !content) {
            res.status(400).json({ message: "Title and content are required" });
            return;
        }

        // ✅ Generate base slug
        let slug = slugify(title, {
            lower: true,
            strict: true, 
            trim: true,
        });

        // ✅ Ensure slug is unique
        const slugExists = await Post.findOne({ where: { slug } });
        if (slugExists) {
            slug = `${slug}-${Date.now()}`;
        }

        const post = await Post.create({
            title,
            content,
            published: published ?? false,
            userId,
            slug,
        });

        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const search = req.query.search as string | undefined;

        const offset = (page - 1) * limit;

        const whereCondition = search
            ? {
                title: {
                    [Op.like]: `%${search}%`,
                },
            }
            : {};

        const { rows, count } = await Post.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            page,
            limit,
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            posts: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};


const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const post = await Post.findByPk(id);

        if (!post) {
            res.status(404).json({
                message: "Post not found",
            });
            return;
        }

        res.status(200).json({ post });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content, published } = req.body;
        const userId = (req as any).user.id;

        const post = await Post.findByPk(id);

        if (!post) {
            res.status(404).json({
                message: "Post not found",
            });
            return;
        }

        // ✅ Ownership check
        if (post.userId !== userId) {
            res.status(403).json({
                message: "Not authorized to update this post",
            });
            return;
        }

        await post.update({
            title: title ?? post.title,
            content: content ?? post.content,
            published: published ?? post.published,
        });

        res.status(200).json({
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};


const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const post = await Post.findByPk(id);

        if (!post) {
            res.status(404).json({
                message: "Post not found",
            });
            return;
        }

        // ✅ Ownership check
        if (post.userId !== userId) {
            res.status(403).json({
                message: "Not authorized to delete this post",
            });
            return;
        }

        await post.destroy();

        res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
};
