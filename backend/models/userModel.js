import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  college: {
    type: String,
    required: function () {
      // college is required only if roll is not provided
      return !this.roll;
    },
  },

  roll: {
    type: String,
    required: function () {
      // roll is required only if college is not provided
      return !this.college;
    },
  },

  passwordHash: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },

  iiestian: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;