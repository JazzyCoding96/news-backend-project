const express = require('express');
const { getAllTopics } = require('./controllers/topics');
const { getEndpoints } = require('./controllers/endpoint');
const { getArticleById, getAllArticles, getAllComments } = require('./controllers/article');
const app = express()


app.use(express.json())

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/", getAllArticles)

app.get("/api/articles/:article_id/comments", getAllComments)


app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  
  res.status(404).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(404).send();
});

module.exports = app;


/*

Remember to add a description of this endpoint to your /api endpoint.*/