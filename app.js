const express = require('express');
const { getAllTopics } = require('./controllers/topics');
const app = express()

app.use(express.json())

app.get("/api/topics", getAllTopics);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err)
  res.status(404).send({ msg: "Bad request" });
});

module.exports = app




/*GET /api/topics
should:
-be available on endpoint /api/topics.
-get all topics.

Responds with:
-an array of topic objects, each of which should have the following properties:
-slug
description
As this is the first endpoint, you will need to set up your testing suite.

Consider what errors could occur with this endpoint. As this is your first endpoint you may wish to also consider any general errors that could occur when making any type of request to your api. The errors that you identify should be fully tested for.

Note: although you may consider handling a 500 error in your app, we would not expect you to explicitly test for this.*/