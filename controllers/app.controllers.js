const { selectCategories, selectReview } = require("../models/app.models");

function getCategories(req, res) {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
}

function getReview(req, res, next) {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => res.status(200).send({ review }))
    .catch(next);
}

module.exports = { getCategories, getReview };
