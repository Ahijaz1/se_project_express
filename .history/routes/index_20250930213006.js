const router = require("express").Router();

const clothingItem = require("./clothingItem");

const usersRouter = require("./users");

router.use("/users", usersRouter);

router.use(req, res) => {
  res.status(500).send({ message: "Router not found" })
}

module.exports = router;
