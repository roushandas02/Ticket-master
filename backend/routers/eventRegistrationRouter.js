import express from "express";
import { registerTeam } from "../controllers/eventRegistrationContoller.js";

const eventRegistrationRouter = express.Router();

// POST /api/event-registration/team
eventRegistrationRouter.post("/team", registerTeam);

export default eventRegistrationRouter;
