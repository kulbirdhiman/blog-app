import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDb";
import cookieParser from "cookie-parser";
//routes
import Userroutes from "./routes/user.routes"
import PostRoutes from "./routes/post.routes"
import CommentRoutes from "./routes/comments.routes"
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())


//routes
app.use("/api/users", Userroutes)
app.use("/api/posts", PostRoutes)
app.use("/api/comments" , CommentRoutes)

connectDb();
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
