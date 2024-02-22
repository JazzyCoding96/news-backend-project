const express = require("express");
const { getAllTopics } = require("./controllers/topics");
const { getEndpoints } = require("./controllers/endpoint");
const {
  getArticleById,
  getAllArticles,
  getAllComments,
  addComment,
  patchArticle,
} = require("./controllers/article");
const { deleteComment } = require("./controllers/comment");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllComments);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});
app.use((err, req, res, next) => {
  res.status(404).send();
});

module.exports = app;

/*DELETE /api/comments/:comment_id
Description
Should:

be available on /api/comments/:comment_id.
delete the given comment by comment_id.
Responds with:

status 204 and no content.
Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.*/
