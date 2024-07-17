const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller.js");
const { getEndpoints } = require("./controllers/endpoints.controller.js");
const { getArticleById, getArticles } = require("./controllers/articles.controller.js");
const { dbErrorHandler, customErrorHandler, serverErrorHandler } = require("./error-handlers");

app.get("/api/topics", getTopics);

app.get('/api', getEndpoints)

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.use(dbErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;