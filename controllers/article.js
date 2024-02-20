const { selectArticleById, fetchAllArticles, commentsByArticleId } = require("../models/article")


exports.getArticleById = (req, res, next) => {
    
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send(article)
    }).catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles().then((articles) => {
    res.status(200).send(articles);
  });
};

exports.getAllComments = (req, res, next) => {
  const { article_id } = req.params;
  commentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => next(err));
};