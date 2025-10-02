const clothingItems = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItems.create({ name, weather, imageUrl }).then((item) => {
    console.log(item);
    res
      .send({ data: item })
      .catch((err) =>
        res.status(500).send({ message: "Error from createItem' ,errr})
  })
};
