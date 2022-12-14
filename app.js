const express = require("express");
const {
  getCategories,
  getReview,
  getComments,
} = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews/:review_id/comments", getComments);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.all("*", handleInvalidPath);
app.use((err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
