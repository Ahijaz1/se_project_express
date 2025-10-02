const { model } = require("mongoose");
const User = require("../models/user");

const getUserByIds = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUserByIds };
