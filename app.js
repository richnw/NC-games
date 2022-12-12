const express = require("express");
const { getCategories } = require("./controllers/app.controllers");
const { handleInvalidPath } = require("./controllers/errors.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.all("*", handleInvalidPath);
app.use((err, req, res) => {
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
