const { selectCategories } = require("../models/app.models");

function getCategories(req, res) {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
}

module.exports = { getCategories };
