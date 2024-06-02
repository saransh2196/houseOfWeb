import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mongodb connection
const mongoURI = `mongodb+srv://saransh2196:cRhOaqKvgIfxxe4d@user-management-cluster.zuzohca.mongodb.net/?retryWrites=true&w=majority&appName=user-management-cluster`;
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//routes
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, User management api!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
