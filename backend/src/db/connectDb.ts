import sequelize from "../config/databaseConfig";

const connectDb = async () => {
    try {
        await sequelize.authenticate({});
        console.log("✅ MySQL connected successfully");
        await sequelize.sync({ alter: true });
        console.log("Models synced");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
}

export default connectDb;