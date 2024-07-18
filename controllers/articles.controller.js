const { fetchArticleById, fetchArticles, updateArticleById } = require("../models/articles.model.js");

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getArticles = (request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({ articles });
    })
    .catch((err) => {
        next(err);
    });
};

exports.patchArticleById = (request, response, next) => {
    return updateArticleById(request.params.article_id, request.body.inc_votes)
      .then((article) =>
        response.status(200).send({ article })
      )
      .catch((err) => {
        next(err);
    });
  }