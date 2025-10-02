const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItem");

// GET /users
router.get("/", getUserByIds);

// GET user by ID
router.get("/:userId", getUserById);

// POST /users
router.post("/", createUser);

module.exports = router;

// Create a new clothing item
router.post("/", createItem);

// Read all clothing items
router.get("/", getItems);

// Update a clothing item by ID
router.put("/:itemId", updateItem);

// Delete a clothing item by ID
router.delete("/:itemId", deleteItem);

module.exports = router;
