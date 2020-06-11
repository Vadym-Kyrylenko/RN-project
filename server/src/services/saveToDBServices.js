const mongoose = require('mongoose');
// const parse = require('./scraping').parse;
const models = require('../models');
const request = require('request-promise');
const msg = require('../i18n/en').msg;

const saveToDBServices = async function () {
try {
    // mongoose.connection.dropDatabase()
    //     .then(function () {
    //         console.log(msg.databaseDropped);
    //     })
    //     .catch(function (err) {
    //         throw err;
    //     });

    parse().then(async data => {
        await models.Product.insertMany(data).then(function () {
            console.log(msg.productsSavedSuccessfully);
        });
        return data
    }).then(async (data) => {
        imgAll(data);
    }).catch(err => {throw err})

} catch (err) {
    mongoose.disconnect();
    console.error(msg.saveFailed, err);
}
};

module.exports.start = saveToDBServices;

let imgAll = (products) => {
    return new Promise(() => {
        let images = [];
        products.map(async (item) => {
            const imgPath = item.imgSrc;
            await imgOne(imgPath).then(data => {
                images.push(data);
            });
            if (images.length === products.length) {
                models.Image.insertMany(images, function (err) {
                    if (!err) {
                        console.log(msg.createdImages);
                    } else {
                        console.log(err);
                    }
                });
            }
        })
    })
};

let imgOne = (path) => {
    return new Promise((resolve) => {
        models.Product.findOne({imgSrc: path}, async function (err, prod) {
            const path = prod.imgSrc;
            let options = {
                url: path,
                method: 'get',
                encoding: null
            };
            const body = await request(options);
            const img = {
                imgData: body,
                productId: prod._id
            };
            resolve(img)
        })
    });
};
