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

// Generic server error message
const GENERIC_SERVER_ERROR = "An error has occurred on the server.";

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --------------------- POST /items ---------------------
const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id;

    if (!name || name.length < 2 || name.length > 30) {
      throw new BadRequestError("Name must be 2–30 characters", 400);
    }
    if (!weather || typeof weather !== "string") {
      throw new BadRequestError("Weather is required", 400);
    }
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new BadRequestError("Image URL is required", 400);
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).json(item);
  } catch (err) {
    // Mongoose validation error (invalid URL format etc.)
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message, 400));
    }
    next(err);
  }
};

// --------------------- GET /items ---------------------
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

// --------------------- PUT /items/:itemId ---------------------
const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!isValidId(itemId))
      throw new BadRequestError("Invalid item ID", BAD_REQUEST);

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      {
        name: req.body.name,
        weather: req.body.weather,
        imageUrl: req.body.imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!item) throw new NotFoundError("Item not found", NOT_FOUND);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// --------------------- DELETE /items/:itemId ---------------------
const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    if (!isValidId(itemId))
      throw new BadRequestError("Invalid item ID", BAD_REQUEST);

    const item = await ClothingItem.findById(itemId);
    if (!item) throw new NotFoundError("Item not found", NOT_FOUND);

    if (item.owner.toString() !== userId) {
      throw new ForbiddenError("You are not allowed to delete this item", 403);
    }

    await ClothingItem.findByIdAndDelete(itemId);
    res.status(200).json({ message: "Clothing item deleted" });
  } catch (err) {
    next(err);
  }
};

// --------------------- PUT /items/:itemId/likes ---------------------
const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    if (!isValidId(itemId) || !isValidId(userId)) {
      throw new BadRequestError("Invalid item or user ID", BAD_REQUEST);
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!item) throw new NotFoundError("Item not found", NOT_FOUND);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// --------------------- DELETE /items/:itemId/likes ---------------------
const dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    if (!isValidId(itemId) || !isValidId(userId)) {
      throw new BadRequestError("Invalid item or user ID", BAD_REQUEST);
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!item) throw new NotFoundError("Item not found", NOT_FOUND);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// --------------------- EXPORT ---------------------
module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
