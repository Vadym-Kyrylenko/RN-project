const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    article: {
        type: String,
    },
    description: {
        type: String,
    },
    specifications: {
        type: Object,
    },
    imgSrc: {
        type: String,
    },
    category: {
        type: String,
    },
    wheelDiametr: {
        type: String,
    },

    rating: {
      type: Array
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
