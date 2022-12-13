const express = require("express");
const { getCategories, getReview } = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  handleIdNotInDatabase,
  handleBadRequest,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.all("*", handleInvalidPath);
app.use((err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
