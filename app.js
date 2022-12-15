const express = require("express");
const {
  getCategories,
  getReviewById,
  getCommentsById,
  getReviews,
} = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsById);
app.get("/api/reviews", getReviews);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.all("*", handleInvalidPath);
app.use((err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
