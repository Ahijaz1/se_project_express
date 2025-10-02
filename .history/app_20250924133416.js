const express = require("express");

const app = express();

const { PORT = 3001 } = process.env;

app.listen(30001, () => {
  console.log("Server is running on port 30001");
});
