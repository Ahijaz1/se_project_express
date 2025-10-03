const express = require("express");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

const router = express.Router();

// GET all items
router.get("/", getItems);

// POST new item
router.post("/", createItem);

// DELETE item by ID
router.delete("/:itemId", deleteItem);

// LIKE an item
router.put("/:itemId/likes", likeItem);

// DISLIKE an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
