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

function selectReviews() {
  console.log("IN MODEL");
  return db
    .query(
      "SELECT reviews.review_id, reviews.created_at, reviews.votes, owner, title, category, review_img_url, designer, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id, comments.review_id ORDER BY reviews.created_at DESC;"
    )
    .then((result) => result.rows);
}

module.exports = {
  selectCategories,
  selectReview,
  selectComments,
  selectReviews,
};
