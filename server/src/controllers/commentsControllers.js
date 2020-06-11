const services = require('../services');
const msg = require('../i18n/en').msg;

module.exports.saveComment = (req, res) => {
    if (!req.body) {
        return res.status(400).send(msg.noRequestBody);
    }
    if (!req.body.parentCommentId) {
        services.comment.postComment(req.body).then(async comment => {
            await res.status(201).send({comment: comment, message: msg.commentSaved}).end();

        }).catch((err) => {
            console.log(err);
            res.json(msg.error)
        })
    } else {
        services.comment.addSubComment(req.body).then(async comment => {

            await res.send({comment: comment, message: msg.commentEdited})
        }).catch((err) => {
            console.log(err);
            res.json(msg.error)
        })
    }
};

module.exports.getComment = function (req, res) {
    let id = req.params.id;
    services.comment.getComment(id).then(comment => {
        res.status(200).send(comment);
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};


module.exports.like = (req, res) => {
    if (!req.body) {
        return res.status(400).send(msg.noRequestBody);
    }

    services.comment.like(req.body).then(async comment => {
        await res.status(201).send({comment: comment, message: msg.commentSaved}).end();

    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.putComment = function (req, res) {
    if (!req.body._id) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body._id;

    services.comment.putComment(id, req.body).then(async comment => {

        await res.send({comment: comment, message: msg.commentEdited})
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.deleteComment = function (req, res) {
    if (!req.body) {
        return res.status(400).send(msg.noRequestBody);
    }

    services.comment.deleteComment(req.body).then(() => {
        res.send({message: msg.commentDeleted})
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};
