const express = require('express');
const { getAllTopics } = require('./controllers/topics');
const { getEndpoints } = require('./controllers/endpoint');
const app = express()


app.use(express.json())

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints)

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(404).send();
});

module.exports = app;




/**/