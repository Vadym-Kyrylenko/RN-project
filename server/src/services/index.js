const image = require('./imageServices');
const product = require('./productServices');
const parse = require('./scrapingServices');
const saveToDB = require('./saveToDBServices');
const user = require('./userServices');
const avatar = require('./avatarServices');
const comment = require('./commentServices');

module.exports = {
    image,
    product,
    parse,
    saveToDB,
    user,
    avatar,
    comment
};
