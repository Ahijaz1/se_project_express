const ClothingItem = require("../models/clothingItem");

// GET all items
const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.status(200).send(items))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// POST create item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: "Name must be 2-30 characters" });
  }
  if (!weather || !imageUrl) {
    return res
      .status(400)
      .send({ message: "Weather and imageUrl are required" });
  }

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(400).send({ message: err.message });
      res.status(500).send({ message: err.message });
    });
};

// PUT update item
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;

  // Update and run validators
  ClothingItem.findByIdAndUpdate(
    itemId,
    { name, weather, imageUrl },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) {
        // If itemId is valid but not found in DB
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item); // successful update
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // Invalid Mongo ObjectId format
        return res.status(400).send({ message: "Invalid item ID" });
      }
      res.status(500).send({ message: err.message });
    });
};

// DELETE item
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      res.status(200).send({ message: "Item deleted" });
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "Invalid item ID" });
      res.status(500).send({ message: err.message });
    });
};

// PUT /items/:itemId/likes
const likeItem = (req, res) => {
  if (!req.user?._id)
    return res.status(400).send({ message: "User ID missing" });

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "Invalid item ID" });
      res.status(500).send({ message: err.message });
    });
};

// DELETE /items/:itemId/likes
const dislikeItem = (req, res) => {
  if (!req.user?._id)
    return res.status(400).send({ message: "User ID missing" });

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "Invalid item ID" });
      res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
