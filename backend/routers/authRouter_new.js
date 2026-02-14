import express from "express";
import { Login, Logout, Refresh, Signup, GetAllUsers } from "../controllers/authControllers.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const authRouter=express.Router();

authRouter.post("/signup",Signup);
authRouter.post("/login",Login);
authRouter.get("/refresh",Refresh);
authRouter.get("/logout",Logout);

// Get all users (Admin only)
authRouter.get("/users", isAuth, isAdmin, GetAllUsers);

export default authRouter;
