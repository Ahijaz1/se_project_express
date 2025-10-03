const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// GET all items
router.get("/", getItems);

// POST new item
router.post("/", createItem);

// DELETE an item by ID
router.delete("/:itemId", deleteItem);

// LIKE an item
router.put("/:itemId/likes", likeItem);

// DISLIKE an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
