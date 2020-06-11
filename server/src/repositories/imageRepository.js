const ImageRepository = require('../models').Image;

module.exports.findImage = async (id) => {
    return await ImageRepository.findOne({productId:id})
};

module.exports.postImage = async (data) => {
    return await ImageRepository.create(data)
};

module.exports.updateImage = async (productId, imgData) => {
    return await ImageRepository.findOneAndUpdate({productId}, {imgData}, {new: true})
};

module.exports.deleteImage = async (id) => {
    return await ImageRepository.findByIdAndRemove(id)
};
