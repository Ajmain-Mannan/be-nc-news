const db = require("./db/connection");

exports.checkArticleExists = (article_id) => {
    return db
      .query(
        `SELECT * FROM articles 
        WHERE article_id = $1 ;`,
        [article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return false;
        } else if (rows.length > 0) {
          return true;
        }
      });
  };