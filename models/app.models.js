const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

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
        return checkExists("reviews", "review_id", review_id);
      }
      return review;
    });
}

function selectReviews() {
  return db
    .query(
      "SELECT reviews.review_id, reviews.created_at, reviews.votes, owner, title, category, review_img_url, designer, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id, comments.review_id ORDER BY reviews.created_at DESC;"
    )
    .then((result) => result.rows);
}

const selectComments = async (review_id) => {
  const dbOutput = await db.query(
    "SELECT * FROM comments WHERE review_id = $1 ORDER BY comments.created_at DESC;",
    [review_id]
  );
  if (!dbOutput.rows.length) {
    return checkExists("reviews", "review_id", review_id);
  }
  return dbOutput.rows;
};

module.exports = {
  selectCategories,
  selectReview,
  selectComments,
  selectReviews,
};
