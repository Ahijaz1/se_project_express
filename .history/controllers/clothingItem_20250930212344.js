const ClothingItem = require("../models/clothingItem");

// POST /items
const createItem = (req, res) => {
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ message: "Error creating clothing item", error: err.message });
    });
};

module.exports = { createItem };
