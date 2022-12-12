const { Pool } = require("pg");

exports.categoryData = require("./categories.js");
exports.commentData = require("./comments.js");
exports.reviewData = require("./reviews.js");
exports.userData = require("./users.js");

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
}

module.exports = new Pool();
