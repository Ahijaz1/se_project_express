const express = require("express");
const { createUser, login } = require("../controllers/users");

const router = express.Router();

// NOTE: signup (/signup) and signin (/signin) are registered as public
// routes at the application root in app.js. We avoid duplicating them
// under /users to prevent accidental protection by the users router.

module.exports = router;
