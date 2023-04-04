const mongoose = require("mongoose");

const childCategory = mongoose.model(
  "ChildCategory",
  new mongoose.Schema(
    {
      name: { type: String, unique: true },
      image: String,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        trim: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = childCategory;
