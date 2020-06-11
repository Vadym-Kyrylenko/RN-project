const services = require('../services');
const msg = require('../i18n/en').msg;

module.exports.getProducts = (req, res) => {
    services.product.getProducts(req.query).then(products => {
        res.status(200).send(products);
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.getProduct = (req, res) => {
    let id = req.params.id;
    services.product.getProduct(id).then(product => {
        res.status(200).send(product);
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.postProducts = (req, res) => {
    const imgData = Buffer.from(req.body.img.imageBase64, 'base64');

    if (!req.body) {
        return res.status(400).send(msg.noRequestBody);
    }

    services.product.postProduct(req.body).then(async product => {
        await services.image.postImage(product.id, imgData);
        await res.status(201).send({product: product, status: 6, message: msg.productSaved}).end();

    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.putProduct = (req, res) => {
    if (!req.body._id) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body._id;

    services.product.putProduct(id, req.body).then(async product => {
        if (req.body.img) {
            const imgData = await Buffer.from(req.body.img.imageBase64, 'base64');
            await services.image.putImage(product.id, imgData);
            await res.send({product: product, status: 9, message: msg.productEdited})

        } else {
            await res.send({product: product, status: 9, message: msg.productEdited})
        }
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.deleteProduct = (req, res) => {
    if (!req.body._id) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body._id;

    services.product.deleteProduct(id).then(() => {
        res.send({message: msg.productDeleted, status: 11})
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.setRatingProduct = (req, res) => {
    if (!req.body.data.productId) {
        return res.status(400).send(msg.noRequestBodyId);
    }
    let id = req.body.data.productId;

    services.product.setRatingProduct(id, req.body).then(async product => {
        await res.send({product: product, message: msg.productEdited})

    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};

module.exports.getBasketProducts = (req, res) => {
    const arrId = req.params.arr.split(',');
    services.product.getBasketProducts(arrId).then(products => {
        res.status(200).send(products);
    }).catch((err) => {
        console.log(err);
        res.json(msg.error)
    })
};