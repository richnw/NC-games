const { selectCategories, selectReviews } = require("../models/app.models");

function getCategories(req, res, next) {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
}

function getReviews(req, res, next) {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
}

module.exports = { getCategories, getReviews };
