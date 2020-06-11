const services = require('../services');
const msg = require('../i18n/en').msg;


module.exports.getUser = function (req, res) {
    let id = req.params.id;
    services.user.getUser(id).then(user => {
        res.status(200).send(user);
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.getUsers = function (req, res) {
    services.user.getUsers().then(users => {
        res.status(200).send(users);
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.putUser = function (req, res) {
    if (!req.body._id) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body._id;

    services.user.putUser(id, req.body).then(async user => {
        if (req.body.avatar) {
            const avatarData = await Buffer.from(req.body.avatar.imageBase64, 'base64');
            await services.avatar.putAvatar(user.id, avatarData);
            await res.send({user: user, status: 3, message: msg.userEdited})
        } else {
            await res.send({user: user, status: 3, message: msg.userEdited})
        }
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.deleteUser = function (req, res) {
    if (!req.body._id) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body._id;

    services.user.deleteUser(id).then(() => {
        res.send({message: msg.userDeleted})
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.addProductToBasket = (req, res) => {
    if (!req.body.userId) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body.userId;

    services.user.addProductToBasket(id, req.body).then(async user => {
        await res.send({user: user, message: msg.userEdited})

    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.delProductFromBasket = (req, res) => {
    if (!req.body.userId) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body.userId;

    services.user.delProductFromBasket(id, req.body).then(async user => {
        await res.send({user: user, message: msg.userEdited})

    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.changePassword = (req, res) => {
    const id = req.body.userId;
    services.user.changePassword(id, req.body).then(async response => {
        await res.send(response)
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.putUserForAdmin = function (req, res) {
    if (!req.body._id) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body._id;

    services.user.putUserForAdmin(id, req.body).then(async user => {
        if (req.body.avatar) {
            const avatarData = await Buffer.from(req.body.avatar.imageBase64, 'base64');
            await services.avatar.putAvatar(user.id, avatarData);
            await res.send({user: user, status: 4, message: msg.userEdited})
        } else {
            await res.send({user: user, status: 4, message: msg.userEdited})
        }
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.forgotPassword = function (req, res) {
    if (!req.body.email) {
        return res.status(400).send(msg.noRequestBodyMail);
    }
    let email = req.body.email;
    services.user.forgotPassword(email).then(response => {
        res.send({status: response.status, message: response.message})
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.getUserBlocked = function (req, res) {
    res.send({status: 5, message: 'User blocked'})
};
