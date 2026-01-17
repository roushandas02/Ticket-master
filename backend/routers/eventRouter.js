import express from "express";
import upload from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";
import { Create, EventList } from "../controllers/eventControllers.js";

const eventRouter=express.Router();

eventRouter.post("/create",upload.single("image"),Create);
eventRouter.get("/list",EventList);

export default eventRouter;