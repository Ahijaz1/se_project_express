const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingItem");

// Mount routers
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

const { NOT_FOUND, ERROR_MESSAGES } = require("../utils/constants");

// fallback 404
router.use((req, res) => {
  res
    .status(NOT_FOUND)
    .send({ message: `${ERROR_MESSAGES.NOT_FOUND} for ${req.method} ${req.originalUrl}` });
});

module.exports = router;
