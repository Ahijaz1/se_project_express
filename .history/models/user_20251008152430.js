const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    validate: {
      validator: (v) => validator.isURL(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // ensures no duplicate emails
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // don’t return password when querying users
  },
});

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if changed

  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Custom static method to verify email + password
userSchema.statics.findUserByCredentials = async function (email, password) {
  // select password explicitly since select: false in schema
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

module.exports = mongoose.model("User", userSchema);
