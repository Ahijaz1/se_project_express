const router = require("express").Router();
const itemsRouter = require("./items");
const usersRouter = require("./users");

// mount subrouters
router.use("/items", itemsRouter);
router.use("/users", usersRouter);

// fallback 404
router.use((req, res) => {
  res
    .status(404)
    .send({ message: `Router not found for ${req.method} ${req.originalUrl}` });
});

module.exports = router;
