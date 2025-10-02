const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// Create a new clothing item
router.post("/", createItem);

// Read all clothing items
router.get("/", getItems);

// Update a clothing item by ID
router.put("/:itemId", updateItem);

// Delete a clothing item by ID
router.delete("/:itemId", deleteItem);

// like/unlike routes
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
