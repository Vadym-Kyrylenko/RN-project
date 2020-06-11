const productRepository = require('../repositories/productRepository');
const imgRepository = require('../repositories/imageRepository');
const msg = require('../i18n/en').msg;

module.exports.getProduct = (id) => {
    return productRepository.findProduct(id)
};

module.exports.getProducts = (filter) => {
    return productRepository.findProducts(filter)
};

module.exports.postProduct = async (body) => {
    let newProduct = {
        title: body.title,
        price: body.price,
        article: body.article,
        imgSrc: body.imgSrc,
        category: body.category || 'category',
        description: body.description || null,
        specifications: body.specifications || null,
    };
    return await productRepository.createProduct(newProduct);
};

module.exports.putProduct = async (id, body) => {
    let newProduct = {
        title: body.title,
        price: body.price,
        article: body.article,
        imgSrc: body.imgSrc,
        description: body.description,
        specifications: body.specifications,
    };
    return await productRepository.updateProduct(id, newProduct);
};

module.exports.deleteProduct = async (id) => {
    return await imgRepository.findImage(id).then(image => {
        return imgRepository.deleteImage(image._id).then(() => {
            return productRepository.deleteProduct(id)
                .then(() => {
                    return msg.productDeleted
                }).catch((err) => {
                    console.log(err);
                    return msg.error
                })
        }).catch(() => {
            imgRepository.postImage(image);
            return msg.errorOnRemoveProduct
        })
    }).catch(() => {
        return msg.errorOnRemoveImage
    })
};

module.exports.setRatingProduct = async (id, body) => {
    let rating = body.data.rating;
    return await productRepository.findProduct(id).then(async product => {
            if (product.rating.length > 0) {
                const p = await product.rating.filter(item => item.userId !== body.data.rating.userId);
                product.rating.length = 0;
                if (p.length > 0) {
                    product.rating.push(...p, rating)

                } else {
                    await product.rating.push(rating);
                }
                return await productRepository.updateProduct(product._id, product);
            } else {
                product.rating.push(rating);
                return await productRepository.updateProduct(product._id, product);
            }

        }
    );
};

module.exports.getBasketProducts = (arrId) => {
    return productRepository.findBasketProducts(arrId)
};
