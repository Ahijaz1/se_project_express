const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingItem");
const { createUser, login } = require("../controllers/users");
const {
  validateUserCreation,
  validateAuthentication,
} = require("../middlewares/validation");

// ---------- Public Routes ---------- //
router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateAuthentication, login);

// Mount routers
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

const { NOT_FOUND, ERROR_MESSAGES } = require("../utils/constants");

// fallback 404
router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: `${ERROR_MESSAGES.NOT_FOUND} for ${req.method} ${req.originalUrl}`,
  });
});

module.exports = router;
