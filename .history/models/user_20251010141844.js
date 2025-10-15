const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [30, "Name must be at most 30 characters"],
  },
  avatar: {
    type: String,
    required: [true, "Avatar URL is required"],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "Avatar must be a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "Email must be a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // Hide password from queries by default
  },
});

// Custom static method to verify credentials
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Incorrect email or password");
    error.statusCode = 401;
    throw error;
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    const error = new Error("Incorrect email or password");
    error.statusCode = 401;
    throw error;
  }

  return user;
};

// Pre-save middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Export the model
module.exports = mongoose.model("User", userSchema);
