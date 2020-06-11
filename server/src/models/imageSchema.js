const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({

    productId: {
        type: Schema.Types.ObjectId, ref: 'Product'
    },
    imgData: {
        type: Buffer,
    }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
