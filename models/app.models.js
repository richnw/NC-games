const db = require("../db/connection");

function selectCategories() {
  return db
    .query("SELECT slug, description FROM categories;")
    .then((result) => result.rows);
}

function selectReview(review_id) {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: "There is no review with that ID number",
        });
      }
      return review;
    });
}

function selectComments(review_id) {
  return db
    .query("SELECT * FROM comments WHERE review_id = $1;", [review_id])
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { selectCategories, selectReview, selectComments };
