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
      `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.commentsByArticleId = (article_id) => {
    const regex = /^\d+$/
    if (regex.test(article_id) === false) {

      return Promise.reject({
        status: 400,
        msg: `Invalid article`,
      });
    }
    return Promise.all([
      db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]),
      db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [article_id]
      ),
    ]).then(([article, comment]) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: `Article does not exist`,
        });
      }

      return comment.rows;
    });
};

exports.insertComment = (article_id, body, username) => {
  return db
    .query(`SELECT username FROM users WHERE username = $1`, [username])
    .then((users) => {
      if (users.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: `Username '${username}' does not exist`,
        });
      }
      return db
        .query(
          `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *`,
          [article_id, body, username]
        )
        .then((result) => {
          return result.rows[0];
        });
    });
};

/*POST /api/articles/:article_id/comments
Description
Should:

-be available on /api/articles/:article_id/comments.
-add a comment for an article.
Request body accepts:

an object with the following properties:
-username
-body
Responds with:

-the posted comment.

Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.*/

