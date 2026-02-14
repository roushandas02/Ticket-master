import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      required: true
    },

    prize: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    tags: {
        type: [String],
        default: []
    },

    venue: {
      type: String,
      required: true
    },
    
    fees: {
      type: String,
      required: true
    },
    
    teamSize: {
      type: String,
      required: true
    },

    rules: {
        type: [String],
        default: []
    },
    
  },
  { timestamps: true }
);

const Event= mongoose.model("Event", eventSchema);
export default Event;
