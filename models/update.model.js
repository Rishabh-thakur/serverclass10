const mongoose = require("mongoose");

const resource = mongoose.model(
  "update",
  new mongoose.Schema(
    {
      name: { type: String, unique: true },
      pdf: String,
      childCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChildCategory",
        trim: true,
      }
    },
    { timestamps: true }
  )
);

module.exports = resource;
