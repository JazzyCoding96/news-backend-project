/**Controller: Handles the client request, and using the information contained on the request (path, params, queries and body) will invoke the model which will interact with the dataset, and will then send a response to the client with the appropriate data.
 */
const { selectAllTopics } = require("../models/topics")

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
