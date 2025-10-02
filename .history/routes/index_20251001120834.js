const router = require("express").Router();
const clothingItemRouter = require("./clothingItem");

// mount routers
router.use("/items", clothingItemRouter);

// fallback for unknown routes
router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
