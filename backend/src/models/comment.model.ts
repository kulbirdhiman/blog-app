import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/databaseConfig";
import User from "./user.model";
import Post from "./post.model";

interface CommentAttributes {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    postId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
    timestamps: true,
    underscored: true,
  }
);

// Associations
Comment.belongsTo(User, { foreignKey: "userId", as: "author", onDelete: "CASCADE" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

Comment.belongsTo(Post, { foreignKey: "postId", as: "post", onDelete: "CASCADE" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

export default Comment;
