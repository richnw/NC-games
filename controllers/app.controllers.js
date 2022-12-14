const {
  selectCategories,
  selectReview,
  selectComments,
  selectReviews,
} = require("../models/app.models");

function getCategories(req, res, next) {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
}

function getReview(req, res, next) {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch(next);
}

function getComments(req, res, next) {
  const { review_id } = req.params;
  selectComments(review_id).then((comments) => res.status(200).send(comments));
}

function getReviews(req, res, next) {
  console.log("in CONTROLLER");
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
}

module.exports = { getCategories, getReview, getComments, getReviews };
