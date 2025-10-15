const jwt = require("jsonwebtoken");
const { User, UnauthorizedError } = require("../models/User");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../utils/errors");
const validator = require("validator");

// GET /users
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET /users/:id
module.exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestError("Invalid user ID");

    const user = await User.findById(id, "-password");
    if (!user) throw new NotFoundError("User not found");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// POST /signup
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      throw new BadRequestError("Invalid email");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError("Email already registered");

    const user = await User.create({ name, avatar, email, password });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (err) {
    if (err.name === "ValidationError")
      next(new BadRequestError("Invalid data"));
    else next(err);
  }
};

// POST /signin
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BadRequestError("Email and password required");

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "dev-secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return res.status(401).json({ message: err.message });
    next(err);
  }
};

// GET /users/me
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, "-password");
    if (!user) throw new NotFoundError("User not found");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me
module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!updatedUser) throw new NotFoundError("User not found");
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError")
      next(new BadRequestError("Invalid data"));
    else next(err);
  }
};
