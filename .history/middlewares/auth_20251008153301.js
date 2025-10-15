const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  // Expect header: Authorization: Bearer <token>
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    // verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // attach payload to request object
    req.user = payload;

    next(); // continue to the next middleware/route
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
