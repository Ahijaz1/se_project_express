const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingItem");

router.use("/users", usersRouter);
router.use("/user", usersRouter);
router.use("/items", itemsRouter);

// fallback 404
router.use((req, res) => {
  res
    .status(404)
    .send({ message: `Router not found for ${req.method} ${req.originalUrl}` });
});

module.exports = router;
