const { model } = require("mongoose");
const User = require("../models/user");

const getUserByIds = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {console.error(err);}

model.exports = { getUserByIds };
