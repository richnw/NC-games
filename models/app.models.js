const db = require("../db/connection");

function selectCategories() {
  return db
    .query("SELECT slug, description FROM categories;")
    .then((result) => result.rows);
}

function selectReviews() {
  return db
    .query(
      "SELECT reviews.review_id, reviews.created_at, reviews.votes, owner, title, category, review_img_url, designer, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id, comments.review_id ORDER BY reviews.created_at DESC;"
    )
    .then((result) => result.rows);
}

module.exports = { selectCategories, selectReviews };
