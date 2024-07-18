const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    return db
        .query("SELECT * from articles WHERE article_id = $1", [article_id])
        .then((response) => {
            if (response.rows.length === 0) {
                return Promise.reject({ status: 404, message: "Not Found" });
            }
            return response.rows[0];
        });
};

exports.fetchArticles = () => {
    return db
        .query(
            `SELECT
                articles.article_id,
                articles.title,
                articles.topic,
                articles.author,
                articles.created_at,
                articles.votes,
                articles.article_img_url,
                COUNT(comments.article_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`
        )
        .then((response) => {
            return response.rows;
        });
};

exports.updateArticleById = (article_id, inc_votes) => {
    const queryString = 
    ` UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`;
    return db.query(queryString, [inc_votes, article_id])
      .then(({ rows }) => {
        if(!rows.length){
            return Promise.reject({ status: 404, message: "Not Found"});
        }
    return rows[0]
    });
};