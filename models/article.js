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

exports.fetchAllArticles = (query) => {
  let columnName 
  let category 
  const queryVals = []
  
  let sqlString = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`
  
  if(query){
    columnName = Object.keys(query)[0]
    category = query[columnName]

    sqlString += ` WHERE ${columnName} = $1`;
    queryVals.push(category);
  }
  sqlString += ` GROUP BY articles.article_id ORDER BY created_at DESC`


  return db
    .query(sqlString, queryVals)
    .then((result) => {
      if (result.rows.length === 0){
        return Promise.reject({
          status: 400,
          msg: "Not found"
        })
      }
      return result.rows;
    })
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

exports.updateArticle = (article_id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article does not exist`,
        });
      }
      return result.rows;
    });
};






/*GET /api/articles (topic query)
Description
FEATURE REQUEST The endpoint should also accept the following query:

--topic, which filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles.


Consider what errors could occur with this endpoint, and make sure to test for them.
You should not have to amend any previous tests.GET /api/articles (topic query)
Description
FEATURE REQUEST The endpoint should also accept the following query:

--topic, which filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles.


Consider what errors could occur with this endpoint, and make sure to test for them.
You should not have to amend any previous tests.*/

