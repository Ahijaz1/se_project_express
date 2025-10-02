const { model } = require("mongoose");
const User = require("../models/user");

const getUserByIds = (req, res) => {
  console.log("IN CONTROLLER");
};

model.exports = { getUserByIds };
