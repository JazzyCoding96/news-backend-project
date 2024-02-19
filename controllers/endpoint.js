const { readEndpoint } = require("../models/endpoint")

exports.getEndpoints = (req, res, next) => {
    readEndpoint().then((endpointData) => {
        res.status(200).send( endpointData )
    })
}