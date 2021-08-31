const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be empty"],
      maxlength: [255, "Name can't be more 255 characters"],
    },
    email: {
      type: String,
      required: true,
      maxlength: [100, "Email can't be more 100 characters"],
      unique: [true, "Email/username already exist"],
    },
    username: {
      required: true,
      type: String,
      maxlength: [50, "Username can't be more 100 characters"],
      unique: [true, "Email/username already exist"],
    },
    password: {
      type: String,
      required: true,
    },
    profile_url: {
      type: String,
    },
    // 1 aktif
    status: {
      type: Number,
      maxlength: 1,
    },
    // 1 admin
    level: {
      type: Number,
      maxlength: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
