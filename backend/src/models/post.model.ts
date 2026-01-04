import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/databaseConfig";
import User from "./user.model";

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id" | "published"> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public slug!: string;
  public published!: boolean;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
    underscored: true,
  }
);

// Associations
Post.belongsTo(User, { foreignKey: "userId", as: "author", onDelete: "CASCADE" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });

export default Post;
