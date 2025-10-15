const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// Accept token from Authorization header (Bearer ...) or cookie named 'jwt'
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  let token;
  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").map((c) => c.trim());
    const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
    if (jwtCookie) token = decodeURIComponent(jwtCookie.split("=")[1]);
  }

  if (!token) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
