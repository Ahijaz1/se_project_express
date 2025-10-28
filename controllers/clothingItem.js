const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

// ------------------ Helper ------------------ //
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ------------------ GET /items ------------------ //
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({}).populate(
      "owner",
      "_id email name"
    );
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

// ------------------ POST /items ------------------ //
const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError(
        "All fields (name, weather, imageUrl) are required"
      );
    }

    const newItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });

    // Populate the owner field to match the format expected by frontend
    const populatedItem = await ClothingItem.findById(newItem._id).populate(
      "owner",
      "_id email name"
    );

    res.status(201).json(populatedItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data provided when creating item"));
    } else {
      next(err);
    }
  }
};

// ------------------ DELETE /items/:itemId ------------------ //
const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    if (!isValidId(itemId)) {
      throw new BadRequestError("Invalid item ID");
    }

    const item = await ClothingItem.findById(itemId);
    if (!item) throw new NotFoundError("Item not found");

    if (item.owner.toString() !== userId) {
      throw new ForbiddenError("You can only delete your own items.");
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// ------------------ PUT /items/:itemId/likes ------------------ //
const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!isValidId(itemId)) throw new BadRequestError("Invalid item ID");

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).populate("owner", "_id email name");

    if (!item) throw new NotFoundError("Item not found");

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// ------------------ DELETE /items/:itemId/likes ------------------ //
const dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!isValidId(itemId)) throw new BadRequestError("Invalid item ID");

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).populate("owner", "_id email name");

    if (!item) throw new NotFoundError("Item not found");

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// ------------------ EXPORTS ------------------ //
module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
