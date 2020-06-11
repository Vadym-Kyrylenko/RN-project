const imgRepository = require('../repositories/imageRepository');

module.exports.getImage = (id) => {
    return imgRepository.findImage(id)
};

module.exports.postImage = (productId, imgData) => {
    const data = {productId, imgData};
    return imgRepository.postImage(data)
};

module.exports.putImage = (productId, imgData) => {
    return imgRepository.updateImage(productId, imgData)
};