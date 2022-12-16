const express = require("express");
const {
  getCategories,
  getReviewById,
  getCommentsById,
  getReviews,
  postComment,
  patchReview,
  getUsers,
} = require("./controllers/app.controllers");
const {
  handleInvalidPath,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsById);
app.get("/api/reviews", getReviews);
app.get("/api/users", getUsers);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReview);
app.all("*", handleInvalidPath);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
