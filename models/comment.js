const db = require("../db/connection")

exports.deleteCommentById = (comment_Id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_Id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comment does not exist`,
        });
      }
    });
};