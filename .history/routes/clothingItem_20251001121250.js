const router = require("express").Router();
const { createItem } = require("../controllers/clothingItem");

// Create a new clothing item
router.post("/", createItem);

//Read all clothing items

// Update a clothing item by ID

// Delete a clothing item by ID

module.exports = router;
