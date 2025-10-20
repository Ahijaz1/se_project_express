const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { UnauthorizedError } = require("../utils/errors");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [30, "Name must be less than 30 characters"],
    },
    avatar: {
      type: String,
      required: [true, "Avatar URL is required"],
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Invalid avatar URL",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // don’t return password in queries by default
    },
  },
  { versionKey: false }
);

// Hash password before saving
async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
}

userSchema.pre("save", hashPassword);

// Static method for credential checking
async function findUserByCredentials(email, password) {
  // find the user by email (include password explicitly)
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  // compare hashed password
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  return user; // successful login
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model("User", userSchema);
