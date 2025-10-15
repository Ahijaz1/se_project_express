const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Hide password from queries by default
  },
});

// Custom static method to verify credentials
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Incorrect email or password");
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new Error("Incorrect email or password");
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
