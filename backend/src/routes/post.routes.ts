import express from "express"
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
} from "../controllers/post.controller"
import { authMiddleware } from "../middlewares/authMiddleware"
const router = express.Router()

router.route("/").post( authMiddleware,createPost).get(getAllPosts)
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost)
export default router