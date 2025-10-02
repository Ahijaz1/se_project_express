const { model } = require("mongoose");
const User = require("../models/user");

const getUserByIds = (req, res) => {
  console.log("GET users");
};

model.exports = { getUserByIds };
