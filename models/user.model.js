const mongoose = require("mongoose");

const user = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: { type: String },
      email: { type: String, required: true },
      phone: { type: Number },
      password: { type: String, required: true },
      otp: { type: Number },
      disabled: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      role: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  )
);

module.exports = user;
