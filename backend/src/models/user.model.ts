import { DataTypes, Model } from "sequelize";
import sequelize from "../config/databaseConfig";

class User extends Model {
  public id!: number;
  public email!: string;
  public username!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [8, 64],
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,

    // ✅ Explicit indexes (this prevents duplication)
    indexes: [
      {
        // unique: true,
        fields: ["email"],
      },
      {
        // unique: true,
        fields: ["username"],
      },
    ],
  }
);

export default User;
