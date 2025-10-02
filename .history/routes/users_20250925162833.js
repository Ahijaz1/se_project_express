const { get } = require("mongoose");

const router = require("express").Router();

router.get("/users", getUserByIds);
router.get("/:userID", () => console.log("GET users by ID"));
router.post("/", () => console.log("POST users"));

module.exports = router;
