const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// PUT /items/:itemId/likes
const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id; // Auth middleware should set this

  if (!isValidId(itemId))
    return res.status(400).json({ message: "Invalid item ID" });
  if (!userId) return res.status(400).json({ message: "User ID missing" });

  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Add user to likes if not already there
    if (!item.likes.includes(userId)) {
      item.likes.push(userId);
      await item.save();
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /items/:itemId/likes
const dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId))
    return res.status(400).json({ message: "Invalid item ID" });
  if (!userId) return res.status(400).json({ message: "User ID missing" });

  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Remove user from likes if present
    item.likes = item.likes.filter((id) => id.toString() !== userId.toString());
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
