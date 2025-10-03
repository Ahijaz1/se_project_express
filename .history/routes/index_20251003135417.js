const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingItem");
const { NOT_FOUND } = require("../utils/error"");

// Mount routers
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

// fallback 404
router.use((req, res) => {
  res
    .status(NOT_FOUND)
    .send({ message: `Router not found for ${req.method} ${req.originalUrl}` });
});

module.exports = router;
