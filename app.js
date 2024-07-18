const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller.js");
const { getEndpoints } = require("./controllers/endpoints.controller.js");
const { getArticleById, getArticles, patchArticleById } = require("./controllers/articles.controller.js");
const { getCommentsByArticleId, postArticleComment } = require("./controllers/comments.controller");
const { dbErrorHandler, customErrorHandler, serverErrorHandler } = require("./error-handlers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get('/api', getEndpoints)

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postArticleComment)

app.patch("/api/articles/:article_id", patchArticleById);

app.use(dbErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;