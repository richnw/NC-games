const express = require("express");
const { getCategories, getReview } = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  handleIdNotInDatabase,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    console.log("getting HERE<<<");
    res.status(err.status).send({ msg: err.msg });
  }
});
app.all("*", handleInvalidPath);
app.use((err, req, res) => {
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
