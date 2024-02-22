const { deleteCommentById } = require("../models/comment")


exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    
    deleteCommentById(comment_id).then(() => {
        res.status(204).send()
    }).catch((err) => {
        next(err)
    })
}



