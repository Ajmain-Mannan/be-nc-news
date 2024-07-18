const db = require("../db/connection");
const { checkArticleExists } = require("../utils");
const format = require("pg-format");

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

exports.insertArticleComment = (article_id, comment) => {
        const {username, body} = comment
        const values = [article_id, username, body]
        const queryString = format(
          `INSERT INTO comments 
          (article_id, author, body) 
           VALUES (%L) 
           RETURNING *`,
          values
        );
        return db.query(queryString).then(({rows}) => {
            return rows[0]
        })
    }

exports.removeCommentById = (comment_id) => {
    return db
        .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, message: "Not Found",
                 });
             }
         });
  };