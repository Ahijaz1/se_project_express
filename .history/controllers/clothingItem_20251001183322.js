const ClothingItem = require("../models/clothingItem");

// POST /items
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        // input is invalid
        return res
          .status(400)
          .send({ message: "Invalid input", error: err.message });
      }
      // other server errors
      res
        .status(500)
        .send({ message: "Error creating clothing item", error: err.message });
    });
};

// GET /items
const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.status(200).send(items))
    .catch((err) =>
      res.status(500).send({
        message: "Error getting clothing items",
        error: err.message,
      })
    );
};

// PUT /items/:itemId
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) =>
      res.status(500).send({
        message: "Error updating clothing item",
        error: err.message,
      })
    );
};

// DELETE /items/:itemId
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Clothing item deleted" }))
    .catch((err) =>
      res.status(500).send({
        message: "Error deleting clothing item",
        error: err.message,
      })
    );
};

// LIKE /items/:itemId/likes
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user?._id || "000000000000000000000000" } },
    { new: true }
  )
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      return res.send(item);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// DISLIKE /items/:itemId/likes
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user?._id || "000000000000000000000000" } },
    { new: true }
  )
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      return res.send(item);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
