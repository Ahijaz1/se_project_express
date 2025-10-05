const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

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
  if (!weather || typeof weather !== "string")
    return res.status(400).json({ message: "Weather is required" });
  if (!imageUrl || typeof imageUrl !== "string")
    return res.status(400).json({ message: "Image URL is required" });
  if (!owner)
    return res.status(401).json({ message: "Unauthorized: user not found" });

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
  }
};

// GET /items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
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
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
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
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
  }
};

// PUT /items/:itemId/likes
const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId) || !isValidId(userId))
    return res.status(400).json({ message: "Invalid item or user ID" });

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
  }
};

// DELETE /items/:itemId/likes
const dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId) || !isValidId(userId))
    return res.status(400).json({ message: "Invalid item or user ID" });

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: GENERIC_SERVER_ERROR });
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
