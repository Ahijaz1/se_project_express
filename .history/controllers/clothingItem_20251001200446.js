const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /items - create a new clothing item
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = await ClothingItem.create({ name, weather, imageUrl });
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /items - get all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /items/:itemId - update clothing item
const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;

  if (!isValidId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { name, weather, imageUrl },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /items/:itemId - delete clothing item
const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!isValidId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndDelete(itemId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Clothing item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /items/:itemId/likes - like a clothing item
const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id; // you must have authentication middleware setting req.user

  if (!isValidId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  if (!isValidId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

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

// DELETE /items/:itemId/likes - unlike a clothing item
const dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  if (!isValidId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

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
