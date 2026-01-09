import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";
import connectDB from "./config/db.js";
dotenv.config();


const app=express();
const PORT=process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/auth",authRouter);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server started on port ${PORT}`);
});





