const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  weather: {
    type: String,
    required: [true, "Weather is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (v) => validator.isURL(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // <-- for like/unlike
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
