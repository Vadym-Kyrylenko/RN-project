const avatarRepository = require('../repositories/avatarRepository');

module.exports.getAvatar = (id) => {
    return avatarRepository.findAvatar(id)
};

module.exports.postAvatar = (userId, avatarData) => {
    const data = {userId, avatarData};
    return avatarRepository.postAvatar(data)
};

module.exports.putAvatar = (userId, avatarData) => {
    return avatarRepository.updateAvatar(userId, avatarData)
};