const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  ERROR_MESSAGES,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /items
const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body || {};
    const owner = req.user?._id;

    if (!owner) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED.message);
    }

    if (
      !name ||
      typeof name !== "string" ||
      name.length < 2 ||
      name.length > 30
    ) {
      throw new BadRequestError("Name must be 2-30 characters");
    }

    if (!weather || !["hot", "warm", "cold"].includes(weather)) {
      throw new BadRequestError("Weather must be 'hot', 'warm', or 'cold'");
    }

    if (!imageUrl || typeof imageUrl !== "string") {
      throw new BadRequestError("Image URL is required");
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    next(err); // pass error to centralized error handler
  }
};

// GET /items
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

// DELETE /items/:itemId
const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    if (!isValidId(itemId)) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST.message);
    }

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.message);
    }

    // Only owner can delete
    if (!item.owner.equals(userId)) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN.message);
    }

    await item.deleteOne();
    return res.status(200).json({ message: "Clothing item deleted" });
  } catch (err) {
    next(err);
  }
};

// PUT /items/:itemId/likes
const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    if (!isValidId(itemId) || !isValidId(userId)) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST.message);
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.message);
    }

    return res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE /items/:itemId/likes
const dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    if (!isValidId(itemId) || !isValidId(userId)) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST.message);
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.message);
    }

    return res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
