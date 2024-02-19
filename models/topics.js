const db = require("../db/connection")

exports.selectAllTopics = () => {
  return db
    .query(
      `SELECT * FROM topics;`
    )
    .then((result) => {
        return result.rows
    })
}


/*
Consider what errors could occur with this endpoint. As this is your first endpoint you may wish to also consider any general errors that could occur when making any type of request to your api. The errors that you identify should be fully tested for.

Note: although you may consider handling a 500 error in your app, we would not expect you to explicitly test for this.*/