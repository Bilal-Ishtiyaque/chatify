import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) throw new Error("MONGO_URI is not set");

        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Connected to MongoDB successfully: ${conn.connection.host}`)
    } catch (error) {
        console.log(`error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectDB;