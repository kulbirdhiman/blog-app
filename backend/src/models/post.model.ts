import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/databaseConfig";
import User from "./user.model";

/**
 * ======================
 * Post Attributes
 * ======================
 */
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

/**
 * ======================
 * Creation Attributes
 * ======================
 */
interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "published"> {}

/**
 * ======================
 * Post Model
 * ======================
 */
class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public slug!: string;
  public published!: boolean;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * ======================
 * Init Model
 * ======================
 */
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
  }
);

/**
 * ======================
 * Associations
 * ======================
 */
// Post.belongsTo(User, {
//   foreignKey: "userId",
//   as: "author",
//   onDelete: "CASCADE",
// });

// User.hasMany(Post, {
//   foreignKey: "userId",
//   as: "posts",
// });

Post.belongsTo(User, {
    foreignKey : "userId",
    as : "authour",
    onDelete : "CASCADE"
})
User.hasMany(Post , {
     foreignKey: "userId",
  as: "posts",
})

export default Post;
