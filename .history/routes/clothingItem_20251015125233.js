const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");

// GET all items
router.get("/", getItems);

// POST new item
router.post("/", auth, createItem);

// DELETE an item by ID
router.delete("/:itemId", auth, deleteItem);

// LIKE an item
router.put("/:itemId/likes", auth, likeItem);

// DISLIKE an item
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
