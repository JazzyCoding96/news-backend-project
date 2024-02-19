const fs = require('fs/promises')

exports.readEndpoint = () => {
    return fs.readFile("./endpoints.json", "utf-8").then((fileData) => {
        return JSON.parse(fileData)
    })
}
