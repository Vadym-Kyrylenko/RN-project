const commentRepository = require('../repositories/commentRepository');

module.exports.postComment = async (body) => {
    let newComment = {
        userId: body.userId,
        productId: body.productId,
        comment: body.text,
        email: body.email,
        createdAt: body.date,
    };
    return await commentRepository.createComment(newComment);
};

module.exports.getComment = (id) => {
    return commentRepository.findComment(id)
};

module.exports.getComments = () => {
    return commentRepository.findComments()
};

module.exports.addSubComment = async (body) => {
    let newSubComment = {
        userId: body.userId,
        productId: body.productId,
        comment: body.text,
        email: body.email,
        createdAt: body.date,
        parentId: body.parentCommentId
    };
    let subComment = await commentRepository.createComment(newSubComment);
    let subCommentNew = {
        _id: subComment._id,
        userId: subComment.userId,
        comment: subComment.comment,
        email: subComment.email,
        createdAt: subComment.createdAt,
        parentId: subComment.parentId,
        liked: subComment.liked,
        reported: subComment.reported
    };
    await commentRepository.deleteComment(subComment._id);
    const newCommentWithSubComment = await commentRepository.findCommentById(body.parentCommentId).then(async comment => {
            await comment.children.push(subCommentNew);
            return await comment
        }
    );
    return await commentRepository.updateComment(body.parentCommentId, newCommentWithSubComment);
};

module.exports.like = async (body) => {
    if (!body.parentId) {
        await commentRepository.findCommentById(body._id).then(async comment => {
            comment.liked = !comment.liked;
            return await commentRepository.updateComment(body._id, comment);
        });
    } else {
        await commentRepository.findCommentById(body.parentId).then(async comment => {
            await comment.children.find(function (child) {
                if (child._id == body._id) {
                    child.liked = !child.liked
                }
            });
            return await commentRepository.updateComment(body.parentId, comment);
        });
    }
};

module.exports.putComment = async (id, body) => {
    let newComment = {
        userId: body.userId,
        productId: body.productId,
        comment: body.text,
        email: body.email,
        createdAt: body.date,
        parentId: body.parentCommentId
    };
    return await commentRepository.updateComment(id, newComment);
};

module.exports.deleteComment = async (body) => {
    if (!body.parentId) {
        return await commentRepository.deleteComment(body._id)
    } else {
        await commentRepository.findCommentById(body.parentId).then(async comment => {
            const p = await comment.children.filter(child => child._id != body._id);
            comment.children.length = 0;
            comment.children.push(...p);
            return await commentRepository.updateComment(body.parentId, comment);
        });
    }
};
