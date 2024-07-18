const { fetchCommentsByArticleId, insertArticleComment } = require("../models/comments.model");


exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    fetchCommentsByArticleId(article_id).then((comments) => {
        response.status(200).send({ comments })
    }) 
    .catch((err) => {
        next(err);
    });
}

exports.postArticleComment = (request, response, next) => {
    insertArticleComment(request.params.article_id, request.body).then((comment) => {
            response.status(201).send({comment})
        }) 
        .catch((err) => {
            next(err);
        });
    }