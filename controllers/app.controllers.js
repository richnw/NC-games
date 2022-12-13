const { selectCategories, selectReviews } = require("../models/app.models");

function getCategories(req, res) {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
}

function getReviews(req, res) {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
}

module.exports = { getCategories, getReviews };
