const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [30, "Name must be at most 30 characters long"],
  },
  weather: {
    type: String,
    required: [true, "Weather is required"],
    enum: {
      values: ["hot", "warm", "cold"],
      message: "Weather must be one of: hot, warm, or cold",
    },
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "Image URL must be a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Must be "User" with uppercase to match model name
    required: [true, "Owner is required"],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Same capitalization fix
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
