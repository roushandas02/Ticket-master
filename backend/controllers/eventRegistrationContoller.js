import mongoose from "mongoose";
import Event from "../models/eventModel.js";
import EventRegistration from "../models/eventRegistrationModel.js";

export const registerTeam = async (req, res) => {
  try {
    const { eventId, teamName, teamSize, teamMembers } = req.body;

    // 1️⃣ Basic validation
    if (!eventId || !teamName || !teamSize || !teamMembers) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    // 3️⃣ Validate team size
    if (!Array.isArray(teamMembers) || teamMembers.length !== teamSize) {
      return res.status(400).json({
        success: false,
        message: "teamMembers count must match teamSize",
      });
    }

    // 4️⃣ Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 5️⃣ Create registration
    const registration = await EventRegistration.create({
      event: event._id,
      teamName,
      teamSize,
      teamMembers,
    });

    res.status(201).json({
      success: true,
      message: "Team registered successfully",
      registration,
    });
  } catch (error) {
    console.error("Event registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
