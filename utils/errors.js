const BadRequestError = require("./errors/BadRequestError");
const UnauthorizedError = require("./errors/UnauthorizedError");
const ForbiddenError = require("./errors/ForbiddenError");
const NotFoundError = require("./errors/NotFoundError");
const ConflictError = require("./errors/ConflictError");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  ERROR_MESSAGES,
} = require("./constants");

const ERROR_CODES = {
  BAD_REQUEST: { status: BAD_REQUEST, message: ERROR_MESSAGES.BAD_REQUEST },
  UNAUTHORIZED: { status: UNAUTHORIZED, message: ERROR_MESSAGES.UNAUTHORIZED },
  FORBIDDEN: { status: FORBIDDEN, message: ERROR_MESSAGES.FORBIDDEN },
  NOT_FOUND: { status: NOT_FOUND, message: ERROR_MESSAGES.NOT_FOUND },
  INTERNAL_SERVER_ERROR: {
    status: INTERNAL_SERVER_ERROR,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  },
  CONFLICT: { status: CONFLICT, message: ERROR_MESSAGES.CONFLICT },
};

module.exports = {
  ERROR_CODES,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
