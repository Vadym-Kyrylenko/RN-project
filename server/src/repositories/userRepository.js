const UserRepository = require('../models').User;


module.exports.findUser = (id) => {
    return UserRepository.findById(id);
};

module.exports.findUsers = async () => {
    return await UserRepository.find()
};

module.exports.updateUser = (id, newUser) => {
    return UserRepository.findByIdAndUpdate(id, newUser, {new: true});
};

module.exports.deleteUser = (id) => {
    return UserRepository.findByIdAndRemove(id);
};

module.exports.findUserEmail = (email) => {
    return UserRepository.findOne({email});
};