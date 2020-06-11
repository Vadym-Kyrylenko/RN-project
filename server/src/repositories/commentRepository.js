const CommentRepository = require('../models').Comment;

module.exports.findComment = (id) => {
    return CommentRepository.find({productId: id})
};

module.exports.findCommentById = (id) => {
    return CommentRepository.findById(id);
};

module.exports.findComments = () => {
    return CommentRepository.find()
};

module.exports.createComment = (newComment) => {
    return CommentRepository.create(newComment)
};

module.exports.updateComment = (id, newComment) => {
    return CommentRepository.findByIdAndUpdate(id, newComment, {new: true})
};

module.exports.deleteComment = (id) => {
    return CommentRepository.findByIdAndRemove(id)
};
