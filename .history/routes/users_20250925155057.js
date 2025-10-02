const router = require("express").Router();

router.get("/users", () => console.log("GET users"));
router.get ("/users//foo, () => console.log("GET users"));

module.exports = router;
