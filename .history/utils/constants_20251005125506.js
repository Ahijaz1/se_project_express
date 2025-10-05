// HTTP status codes
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;

// Default messages (optional but clean to include)
const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Incorrect email or password",
  FORBIDDEN: "You can only delete your own items.",
  NOT_FOUND: "Not Found",
  CONFLICT: "Email already exists",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  ERROR_MESSAGES,
};
