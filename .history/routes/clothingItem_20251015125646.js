const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");

const router = express.Router();

// GET all items (public or protected depending on your app)
router.get("/", auth, getItems);

// POST new item (protected)
router.post("/", auth, createItem);

// DELETE an item by ID (protected)
router.delete("/:itemId", auth, deleteItem);

// LIKE an item (protected)
router.put("/:itemId/likes", auth, likeItem);

// DISLIKE an item (protected)
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
