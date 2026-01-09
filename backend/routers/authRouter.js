import express from "express";
import { Login, Logout, Refresh, Signup } from "../controllers/authControllers.js";

const authRouter=express.Router();

authRouter.post("/signup",Signup);
authRouter.post("/login",Login);
authRouter.get("/refresh",Refresh);
authRouter.get("/logout",Logout);

export default authRouter;