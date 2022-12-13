const db = require("../db/connection");

function selectCategories() {
  return db
    .query("SELECT slug, description FROM categories;")
    .then((result) => result.rows);
}

function selectReviews() {
  return db
    .query(
      "SELECT reviews.review_id, reviews.created_at, reviews.votes, owner, title, category, review_img_url, designer, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id, comments.review_id;"
    )
    .then((result) => result.rows);
}

module.exports = { selectCategories, selectReviews };

// owner, title, review_id, category, review_img_url, created_at, votes, designer
