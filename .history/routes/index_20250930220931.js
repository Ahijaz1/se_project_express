const router = require("express").Router();

const clothingItem = require("./clothingItem");
const usersRouter = require("./users");

// mount routers
router.use("/users", usersRouter);
router.use("/items", clothingItem);

// fallback for unknown routes
router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
