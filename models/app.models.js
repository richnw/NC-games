const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

function selectCategories() {
  return db
    .query("SELECT slug, description FROM categories;")
    .then((result) => result.rows);
}

function selectReview(review_id) {
  return db
    .query(
      "SELECT DISTINCT reviews.review_id, reviews.title, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;",
      [review_id]
    )
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return checkExists("reviews", "review_id", review_id);
      }
      return review;
    });
}

const selectReviews = async (
  category,
  sortBy = "created_at",
  order = "desc"
) => {
  if (
    ![
      "title",
      "designer",
      "owner",
      "review_img_url",
      "review_body",
      "category",
      "created_at",
      "votes",
    ].includes(sortBy)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryString =
    "SELECT reviews.review_id, reviews.created_at, reviews.votes, owner, title, category, review_img_url, designer, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id ";
  let queryString2 = `GROUP BY reviews.review_id, comments.review_id ORDER BY ${sortBy} ${order};`;
  const queryValues = [];
  if (category) {
    queryString += "WHERE category = $1 ";
    queryValues.push(category);
  }
  queryString += queryString2;
  const { rows } = await db.query(queryString, queryValues);
  if (!rows.length) {
    return checkExists("reviews", category);
  }
  return rows;
};

const selectComments = async (review_id) => {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE review_id = $1 ORDER BY comments.created_at DESC;",
    [review_id]
  );
  if (!rows.length) {
    return checkExists("reviews", "review_id", review_id);
  }
  return rows;
};

function insertComment(username, body, review_id) {
  return db
    .query(
      " INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, review_id]
    )
    .then(({ rows }) => rows[0]);
}

function updateReview(inc_votes, review_id) {
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;",
      [inc_votes, review_id]
    )
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: "Resource not found",
        });
      }
      return review;
    });
}

function selectUsers() {
  return db.query("SELECT * FROM users;").then((result) => result.rows);
}

function removeComment(comment_id) {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
}

module.exports = {
  selectCategories,
  selectReview,
  selectComments,
  selectReviews,
  insertComment,
  updateReview,
  selectUsers,
  removeComment,
};
