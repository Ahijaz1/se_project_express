const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/constants");

// Generic server error message (use for unexpected/internal errors)
const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

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
    return next(
      new BadRequestError("Name must be 2-30 characters", BAD_REQUEST)
    );
  }
  if (!weather || typeof weather !== "string") {
    return next(new BadRequestError("Weather is required", BAD_REQUEST));
  }
  if (!imageUrl || typeof imageUrl !== "string") {
    return next(new BadRequestError("Image URL is required", BAD_REQUEST));
  }
  if (!owner) {
    return next(
      new ForbiddenError("Unauthorized: user not found", UNAUTHORIZED)
    );
  }

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// GET /items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// PUT /items/:itemId
const updateItem = async (req, res, next) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;

  if (!isValidId(itemId)) {
    return next(new BadRequestError("Invalid item ID", BAD_REQUEST));
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { name, weather, imageUrl },
      { new: true, runValidators: true }
    );
    if (!item) {
      throw new NotFoundError("Item not found", NOT_FOUND);
    }
    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// DELETE /items/:itemId
const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId)) {
    return next(new BadRequestError("Invalid item ID", BAD_REQUEST));
  }

  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item not found", NOT_FOUND);
    }

    // Check if the logged-in user is the owner
    if (item.owner.toString() !== userId) {
      return next(
        new ForbiddenError("You are not allowed to delete this item", 403)
      );
    }

    await ClothingItem.findByIdAndDelete(itemId);
    return res.status(200).json({ message: "Clothing item deleted" });
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// PUT /items/:itemId/likes
const likeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId) || !isValidId(userId)) {
    return next(new BadRequestError("Invalid item or user ID", BAD_REQUEST));
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) {
      throw new NotFoundError("Item not found", NOT_FOUND);
    }
    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
  }
};

// DELETE /items/:itemId/likes
const dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!isValidId(itemId) || !isValidId(userId)) {
    return next(new BadRequestError("Invalid item or user ID", BAD_REQUEST));
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!item) {
      throw new NotFoundError("Item not found", NOT_FOUND);
    }
    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: GENERIC_SERVER_ERROR });
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
