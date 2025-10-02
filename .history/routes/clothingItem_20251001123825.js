const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
} = require("../controllers/clothingItem");

// Create a new clothing item
router.post("/", createItem);

// Read all clothing items
router.get("/", getItems);

// Update a clothing item by ID

// Delete a clothing item by ID

module.exports = router;
