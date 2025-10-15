const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

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
      select: false,
    },
  },
  { versionKey: false }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Static method for login
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) throw new UnauthorizedError("Incorrect email or password");

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new UnauthorizedError("Incorrect email or password");

  return user;
};

module.exports = {
  User: mongoose.model("User", userSchema),
  UnauthorizedError,
};
