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