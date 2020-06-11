const mongoose = require("mongoose");
const services = require('../src/services');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const config = require('../config').APPCONST;

describe('Test', function() {
    before(function () {
        mongoose.connect(config.dbURL, {useNewUrlParser: true, useFindAndModify: false});
    });
    after(function() {
        mongoose.disconnect();
    });

    describe('getProducts', function () {
        it('get all products from database', async function () {
            const products = await services.product.getProducts();
            products.should.be.a('array')
        })
    });

    describe('getProduct', function () {
        it('get product by ID from database', async function () {
            const id = await services.product.getProducts();
            const res = await services.product.getProduct(`${id[10]._id}`);
            expect(`${res._id}`).to.equal(`${id[10]._id}`);
        })
    });

    describe('addProduct', function () {
        it('add product in database', async function () {
            const newProduct = {
                title: 'Title test',
                price: 777,
                article: 'article_test',
                imgSrc: 'https://veloplaneta.com.ua/media/catalog/product/cache/926507dc7f93631a094422215b778fe0/s/k/skd-70-56.jpg',
                description: 'Лучшая модель BMX велосипеда от производителя Stolen. Абсолютно все компоненты выполнены из хроммолибденовой стали, которая отличается высокими показателями прочности. BMX 20" Stolen SINNER FC LHD будет отличным выбором для опытного и избирательного гонщика, которые уже неплохо разбираются в велосипедном железе и экстремальном стиле катания. Конструкция с левосторонним расположением привода. Колеса собраны на промышленных подшипниках, которые надежно защищены и не требуют обслуживания.Велосипед Stolen SINNER FC LHD будет идеальным для Вас во всех прыжковых стилях катания и исполнения трюков.',
                specifications: ''
            };
            const result = await services.product.postProduct(newProduct);
            expect(`${result.title}`).to.equal(newProduct.title);
        })
    });

    describe('updateProduct', function () {
        it('update product from database', async function () {
            const id = await services.product.getProducts();
            const update = {
                title: 'test_update'
            };
            const result = await services.product.putProduct(`${id[6]._id}`, update);
            expect(`${result.title}`).to.equal(update.title);
        })
    });

    describe('deleteProduct', function () {
        it('delete product from database', async function () {
            const id = await services.product.getProducts();
            const del = await services.product.deleteProduct(`${id[3]._id}`);
            const result = await services.product.getProducts();
            expect(`${result.length}`).to.equal(`${id.length - 1}`);
        })
    });

    describe('getImageByProductId', function () {
        it('get image by product ID from db', async function () {
            const id = await services.product.getProducts();
            const result = await services.image.getImage(`${id[7]._id}`);
            expect(`${result.productId}`).to.equal(`${id[7]._id}`);
        })
    });

    describe('scraping', function () {
        this.timeout(0);
        it('parse', function (done) {
            services.parse.parse().then((data) => {
                data.should.be.a('array');
                done();
            });
        })
    });
});
