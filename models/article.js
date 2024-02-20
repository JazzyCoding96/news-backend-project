const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `Article does not exist`,
        });
      }
      return result.rows[0];
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then((result) => {
      const articleArray = result.rows;
      const newArticleArray = articleArray.map((articleObj) => {
        delete articleObj.body;
        articleObj.comment_count = +articleObj.comment_count
        return articleObj;
      });
      return newArticleArray;
    });
};

/*
In addition:

-the articles should be sorted by date in descending order.
-there should not be a body property present on any of the article objects.
Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.*/

