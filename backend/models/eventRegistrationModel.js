import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      trim: true,
    },
    roll: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  { _id: false }
);

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    teamName: {
      type: String,
      required: true,
      trim: true,
    },

    teamSize: {
      type: Number,
      required: true,
    },

    teamMembers: {
      type: [teamMemberSchema],
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);
