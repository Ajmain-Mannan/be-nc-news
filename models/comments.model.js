const db = require("../db/connection");
const { checkArticleExists } = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = (article_id) => {
    return checkArticleExists(article_id)
      .then((result) => {
        if (result === false) {
          return Promise.reject({ status: 404, message: "Not Found" });
        }
      })
      .then(() => {
        return db.query(
          `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`,
          [article_id],
        );
      })
      .then(({ rows }) => {
        return rows;
    });
    };