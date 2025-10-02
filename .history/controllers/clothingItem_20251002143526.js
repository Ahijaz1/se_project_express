const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /items
const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;

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

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl });
    return res.status(201).json(item); // added return
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
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /items/:itemId
const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;

  if (!isValidId(itemId))
    return res.status(400).json({ message: "Invalid item ID" });

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { name, weather, imageUrl },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ message: err.message });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /items/:itemId
const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  if (!isValidId(itemId))
    return res.status(400).json({ message: "Invalid item ID" });

  try {
    const item = await ClothingItem.findByIdAndDelete(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Clothing item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /items/:itemId/likes
const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id || "68ded77a3c33c6d7231b39a5"; //  test

  if (!isValidId(itemId))
    return res.status(400).json({ message: "Invalid item ID" });
  if (!isValidId(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /items/:itemId/likes
const dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id || "68ded77a3c33c6d7231b39a5"; //  test

  if (!isValidId(itemId))
    return res.status(400).json({ message: "Invalid item ID" });
  if (!isValidId(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
