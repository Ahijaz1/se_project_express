const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

// Accept token from Authorization header (Bearer ...) or cookie named 'jwt'
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  let token;
  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }

  if (!token) {
    throw new UnauthorizedError("Authorization required");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
