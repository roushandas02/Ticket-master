import express from "express";
import { registerTeam, getEventRegistrations, deleteRegistration, getAdminStats } from "../controllers/eventRegistrationContoller.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const eventRegistrationRouter = express.Router();

// POST /api/event-registration/team
eventRegistrationRouter.post("/team", registerTeam);

// GET /api/event-registration/admin/stats - Get admin statistics (Admin only)
eventRegistrationRouter.get("/admin/stats", isAuth, isAdmin, getAdminStats);

// GET /api/event-registration/event/:eventId - Get all registrations for an event (Admin only)
eventRegistrationRouter.get("/event/:eventId", isAuth, isAdmin, getEventRegistrations);

// DELETE /api/event-registration/:registrationId - Delete a registration (Admin only)
eventRegistrationRouter.delete("/:registrationId", isAuth, isAdmin, deleteRegistration);

export default eventRegistrationRouter;
