import { DataTypes, Model } from "sequelize";
import sequelize from "../config/databaseConfig";

class User extends Model {
    public id!: number;
    public email!: string;
    public username!: string;
    public password!: string;
}


User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }, password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 64], // min 8, max 64 characters
                msg: "Password must be between 8 and 64 characters",
            },
        },
    },

},
    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
)

export default User;