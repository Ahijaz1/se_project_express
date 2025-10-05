const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /items
const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body || {};
  const owner = req.user?._id;

  if (
    !name ||
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 30
  ) {
    return next(new BadRequestError("Name must be 2-30 characters"));
  }
  if (!weather || typeof weather !== "string")
    return next(new BadRequestError("Weather is required"));
  if (!imageUrl || typeof imageUrl !== "string")
    return next(new BadRequestError("Image URL is required"));
  if (!owner) return next(new ForbiddenError("Unauthorized: user not found"));

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError")
      return next(new BadRequestError(err.message));
    next(err);
  }
};

// GET /items
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

// PUT /items/:itemId
const updateItem = async (req, res, next) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;

  if (!isValidId(itemId)) return next(new BadRequestError("Invalid item ID"));

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { name, weather, imageUrl },
      { new: true, runValidators: true }
    );
    if (!item) throw new NotFoundError("Item not found");
    res.status(200).json(item);
  } catch (err) {
    if (err.name === "ValidationError")
      return next(new BadRequestError(err.message));
    next(err);
  }
};

// DELETE /items/:itemId
const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;
  if (!isValidId(itemId)) return next(new BadRequestError("Invalid item ID"));

  try {
    const item = await ClothingItem.findByIdAndDelete(itemId);
    if (!item) throw new NotFoundError("Item not found");
    res.status(200).json({ message: "Clothing item deleted" });
  } catch (err) {
    next(err);
  }
};

// PUT /items/:itemId/likes
const likeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId) || !isValidId(userId))
    return next(new BadRequestError("Invalid item or user ID"));

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) throw new NotFoundError("Item not found");
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE /items/:itemId/likes
const dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId) || !isValidId(userId))
    return next(new BadRequestError("Invalid item or user ID"));

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!item) throw new NotFoundError("Item not found");
    res.status(200).json(item);
  } catch (err) {
    next(err);
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
