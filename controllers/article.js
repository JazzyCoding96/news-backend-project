const { selectArticleById, fetchAllArticles } = require("../models/article")


exports.getArticleById = (req, res, next) => {
    
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send(article)
    }).catch((err) => {
        next(err)
    })
}
//controller needs changing, just done this to get result in model with test
exports.getAllArticles = (req, res, next) => {

    fetchAllArticles().then((articles) => {
        res.status(200).send(articles)
    })

}