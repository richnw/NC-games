const {
  selectCategories,
  selectReview,
  selectComments,
  selectReviews,
  insertComment,
  updateReview,
  selectUsers,
} = require("../models/app.models");

function getCategories(req, res, next) {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
}

function getReviewById(req, res, next) {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch(next);
}

function getCommentsById(req, res, next) {
  const { review_id } = req.params;
  selectComments(review_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
}

function getReviews(req, res, next) {
  const category = req.query.category;
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  selectReviews(category, sortBy, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { username, body } = req.body;
  const { review_id } = req.params;
  insertComment(username, body, review_id)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
}

function patchReview(req, res, next) {
  const { inc_votes } = req.body;
  const { review_id } = req.params;
  updateReview(inc_votes, review_id)
    .then((review) => res.status(200).send({ review }))
    .catch(next);
}

function getUsers(req, res, next) {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

module.exports = {
  getCategories,
  getReviewById,
  getCommentsById,
  getReviews,
  postComment,
  patchReview,
  getUsers,
};
