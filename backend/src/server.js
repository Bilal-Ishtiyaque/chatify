import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import connectDB from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//converts json string text into javaScript object
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log(`Hello! Server is running on port ${PORT}`);
    connectDB();
});
