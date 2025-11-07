const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateClothingItemId,
} = require("../middlewares/validation");

const router = express.Router();

// GET all items (public)
router.get("/", getItems);

// POST new item (protected)
router.post("/", auth, validateCardBody, createItem);

// DELETE an item by ID (protected)
router.delete("/:itemId", auth, validateClothingItemId, deleteItem);

// LIKE an item (protected)
router.put("/:itemId/likes", auth, validateClothingItemId, likeItem);

// DISLIKE an item (protected)
router.delete("/:itemId/likes", auth, validateClothingItemId, dislikeItem);

module.exports = router;
