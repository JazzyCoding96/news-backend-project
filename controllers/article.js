const {
  selectArticleById,
  fetchAllArticles,
  commentsByArticleId,
  insertComment,
  updateArticle,
} = require("../models/article");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getAllComments = (req, res, next) => {
  const { article_id } = req.params;
  commentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  if (!username.length || !body.length) {
    return res
      .status(400)
      .send({ msg: "Username and body are required fields" });
  }
  insertComment(article_id, body, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
