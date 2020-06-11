const Image = require('../models').Image;
const services = require('../services');
const msg = require('../i18n/en').msg;

module.exports.getImage = (req, res) => {
    let id = req.params.id;
    services.image.getImage(id).then(image => {
        res.status(200).set('Content-Type', 'image/jpg').send(image.imgData);
    }).catch(() => res.json(msg.error))
};

//for check
module.exports.getImagesId = (req, res) => {
    Image
        .find({})
        .exec(async (err, images) => {
            if (err) {
                return res.status(500).send(msg.errorWhileFindingImages);
            }
            if (!images) {
                return res.status(404).send(msg.notFoundImages);
            }
            const arr = [];
            await images.map((image) => arr.push(image._id));
            await res.status(200).send(arr);
        });
};
