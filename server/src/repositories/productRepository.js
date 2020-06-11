const ProductRepository = require('../models').Product;

module.exports.findProduct = (id) => {
    return ProductRepository.findById(id)
};

module.exports.findProducts = async (filter) => {
    const {minPrice, maxPrice, searchText, category} = filter;
    const min = Number(minPrice);
    const max = Number(maxPrice);
    const categoryArr = category && category.split(',');

    if (min && max && !searchText && !categoryArr) {
        console.log('only price');
        return await ProductRepository.find({price: {$gte: min, $lte: max}})
    } else if (categoryArr && !searchText) {
        console.log('price with categoryArr');
        return await ProductRepository.find({
            $and:
                [
                    {category: categoryArr},
                    {price: {$gte: min, $lte: max}},
                ]
        })
    } else if (searchText && !categoryArr) {
        console.log('price with categoryArr');
        return await ProductRepository.find({
            $and:
                [
                    {description: {"$regex": searchText, "$options": "i"}},
                    {price: {$gte: min, $lte: max}},
                ]
        })
    } else if (searchText && categoryArr) {
        console.log('price with searchText and category');
        return await ProductRepository.find({
            $and:
                [
                    {category: categoryArr},
                    {price: {$gte: min, $lte: max}},
                    searchText && {description: {"$regex": searchText, "$options": "i"}}
                ]
        })
    } else {
        return await ProductRepository.find()
    }
};

module.exports.createProduct = (newProduct) => {
    return ProductRepository.create(newProduct)
};

module.exports.updateProduct = (id, newProduct) => {
    return ProductRepository.findByIdAndUpdate(id, newProduct, {new: true})
};

module.exports.deleteProduct = async (id) => {
    return await ProductRepository.findByIdAndRemove(id)
};

module.exports.findBasketProducts = async (arrId) => {
        return await ProductRepository.find({_id: {$in :arrId}})
};