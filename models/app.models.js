const db = require("../db/connection");

function selectCategories() {
  return db
    .query("SELECT slug, description FROM categories;")
    .then((result) => result.rows);
}

module.exports = { selectCategories };
