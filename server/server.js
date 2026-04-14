import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";
import "./cron/cleanup.js";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
  origin: "*", // later replace with frontend URL
}));

app.use("/api", fileRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));