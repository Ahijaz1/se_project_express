const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /items
const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body || {};
  const owner = req.user?._id;

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30
  ) {
    return res.status(400).json({ message: "Name must be 2-30 characters" });
  }

  if (!weather || typeof weather !== "string") {
    return res.status(400).json({ message: "Weather is required" });
  }

  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({ message: "Image URL is required" });
  }

  if (!owner) {
    return res.status(401).json({ message: "Unauthorized: user not found" });
  }

  try {
    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET /items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json(items);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// DELETE /items/:itemId
const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!isValidId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Clothing item deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// PUT /items/:itemId/likes
const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const { _id: userId = "68ded77a3c33c6d7231b39a5" } = req.user || {};

  if (!isValidId(itemId) || !isValidId(userId)) {
    return res.status(400).json({ message: "Invalid item or user ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// DELETE /items/:itemId/likes
const dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const { _id: userId = "68ded77a3c33c6d7231b39a5" } = req.user || {};

  if (!isValidId(itemId) || !isValidId(userId)) {
    return res.status(400).json({ message: "Invalid item or user ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
