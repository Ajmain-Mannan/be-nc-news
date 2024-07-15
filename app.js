const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller.js");
const { serverErrorHandler } = require("./error-handlers");

app.get("/api/topics", getTopics);



app.use(serverErrorHandler);

module.exports = app;