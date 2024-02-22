const db = require("../db/connection")


exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 400,
        msg: "No users found",
      });
    }
    return result.rows;
  });
};