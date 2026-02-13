import mongoose from "mongoose";
import Event from "../models/eventModel.js";
import EventRegistration from "../models/eventRegistrationModel.js";

// Get admin statistics (Admin only)
export const getAdminStats = async (req, res) => {
  try {
    // Get all registrations with event details
    const registrations = await EventRegistration.find()
      .populate('event', 'name date venue fees')
      .sort({ createdAt: -1 });

    // Calculate total revenue
    let totalRevenue = 0;
    const registrationDetails = [];

    for (const registration of registrations) {
      if (registration.event && registration.event.fees) {
        // Extract numeric value from fees string (e.g., "Rs. 200" -> 200)
        const feeMatch = registration.event.fees.match(/[\d,]+/);
        if (feeMatch) {
          const feeAmount = parseInt(feeMatch[0].replace(/,/g, ''));
          totalRevenue += feeAmount;
        }
      }

      // Flatten team members for the response
      registration.teamMembers.forEach((member) => {
        registrationDetails.push({
          name: member.name,
          email: member.email,
          phone: member.phone,
          college: member.college || 'N/A',
          roll: member.roll || null,
          event: registration.event?.name || 'Unknown Event',
          eventDate: registration.event?.date || null,
          teamName: registration.teamName,
          registrationDate: registration.createdAt,
          isIIEST: !!member.roll,
        });
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalRegistrations: registrationDetails.length,
        totalTeams: registrations.length,
        totalRevenue,
        registrations: registrationDetails,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all registrations for a specific event (Admin only)
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Get all registrations for this event
    const registrations = await EventRegistration.find({ event: eventId })
      .populate('event', 'name date venue')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Get event registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a registration (Admin only)
export const deleteRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID",
      });
    }

    // Find and delete the registration
    const registration = await EventRegistration.findByIdAndDelete(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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
