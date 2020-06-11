const request = require('request-promise');
const cheerio = require('cheerio');
const config = require('../../config').APPCONST;

let scrapingAll = () => {
    const URL = config.parseURL;
    return new Promise((resolve, reject) => {
        request(URL, function (err, res, body) {
            if (err) reject(err);

            let results = [];
            const $ = cheerio.load(body);

            $('.one-goods__wrap-name').each(function () {
                const pageUrl = $('a', this).attr('href');
                scrapingOne(pageUrl).then(data => {
                    results.push(data);
                    if (results.length === $('.one-goods__wrap-name').length) {
                        resolve(results);
                    }
                });
            });
        });
    })
};

let scrapingOne = (pageUrl) => {
    return new Promise((resolve, reject) => {
        request(pageUrl, function (err, res, page) {
            if (err) reject(err);
            const $ = cheerio.load(page);

            $('.page-main').each(function () {

                const title = $('.title-block .title .base', this).text();
                const price = Number($('.product-detail__info .price-box .price-wrapper', this).children().first()
                    .text().slice(0, -4).split(/\s/).join(''));
                const article = $('.column .artikul-value', this).text().trim();
                const description = $('.product.attribute.description', this).text().trim();
                const imgSrc = $('img', this).attr('src');

                const speca = $('.characteristics tr:has(td)').map(function () {
                    let obj = {};
                    const $td = $('td', this);
                    const colL = $td.eq(0).text().trim().split('\n');
                    const colR = $td.eq(1).text().trim().split('\n');
                    // console.log('colL', colL[0], '_____________', colL[1]);
                    // console.log('colR', colR[0], '_____________', colR[1]);

                    obj[colL[0]] = colL[1];
                    console.log('obj', obj);
                    if (colR[1] !== undefined) obj[colR[0]] = colR[1];
                    return Object.assign({}, obj)
                }).get();
                const specifications = Object.assign({}, ...speca);
                const category = '';
                const bike = {
                    title, price, article, description, imgSrc, specifications, category
                };
                resolve(bike);
            });
        })
    });
};

module.exports.parse = scrapingAll;
