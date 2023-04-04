const mongoose = require("mongoose");

const groupCategory = mongoose.model(
  "Category",
  new mongoose.Schema(
    {
      name: { type: String },
      image: String,
    },
    { timestamps: true }
  )
);

module.exports = groupCategory;
