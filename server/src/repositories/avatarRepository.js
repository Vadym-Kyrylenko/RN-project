const AvatarRepository = require('../models').Avatar;

module.exports.findAvatar = (id) => {
    return AvatarRepository.findOne({userId: id});
};

module.exports.postAvatar = (data) => {
    return AvatarRepository.create(data)
};

module.exports.updateAvatar = (userId, avatarData) => {
    return AvatarRepository.findOneAndUpdate({userId}, {avatarData}, {new: true})
};

module.exports.deleteAvatar = (id) => {
    return AvatarRepository.findByIdAndRemove(id)
};
