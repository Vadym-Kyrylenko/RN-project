const Avatar = require('../models').Avatar;
const services = require('../services');
const msg = require('../i18n/en').msg;

module.exports.getAvatar = (req, res) => {
    let id = req.params.id;
    services.avatar.getAvatar(id).then(avatar => {
        res.status(200).set('Content-Type', 'image/jpg').send(avatar.avatarData);
    }).catch(() => res.json(msg.error))
};

//for check
module.exports.getAvatarsId = (req, res) => {
    Avatar
        .find({})
        .exec(async (err, avatars) => {
            if (err) {
                return res.status(500).send(msg.errorWhileFindingAvatars);
            }
            if (!avatars) {
                return res.status(404).send(msg.notFoundAvatars);
            }
            const arr = [];
            await avatars.map((avatar) => arr.push(avatar._id));
            await res.status(200).send(arr);
        });
};
