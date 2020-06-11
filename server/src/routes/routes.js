const express = require('express');
const router = express.Router();
const productControllers = require('../controllers').productControllers;
const imageControllers = require('../controllers').imageControllers;
const userAuthentication = require('../controllers').userAuthentication;
const userControllers = require('../controllers').userControllers;
const avatarControllers = require('../controllers').avatarControllers;
const commentsControllers = require('../controllers').commentsControllers;
const passport = require('passport');

const jwt = require('express-jwt');
const auth = jwt({secret: process.env.JWT_SECRET, userProperty: 'payload'});

router.get('/products', productControllers.getProducts);
router.get('/products/basket/:arr', productControllers.getBasketProducts);
router.get('/product/:id', productControllers.getProduct);
router.post('/products', auth, productControllers.postProducts);
router.put('/products', auth, productControllers.putProduct);
router.put('/product', auth, productControllers.setRatingProduct);
router.delete('/products', auth, productControllers.deleteProduct);

router.get('/image/:id', imageControllers.getImage);
router.get('/images', imageControllers.getImagesId); //for check

router.post('/registration', userAuthentication.registerUser);
router.post('/login', userAuthentication.loginUser);
router.get('/user/:id', userControllers.getUser);
router.get('/users', userControllers.getUsers);
router.put('/users', auth, userControllers.putUser);
router.put('/users/admin', auth, userControllers.putUserForAdmin);
// router.put('/user/basket', userControllers.addProductToBasket);
router.delete('/user/basket', auth, userControllers.delProductFromBasket);
router.put('/user/password', auth, userControllers.changePassword);
router.post('/user/forgot_password', userControllers.forgotPassword);

router.get('/avatar/:id', avatarControllers.getAvatar);
router.get('/avatars', avatarControllers.getAvatarsId); //for check

// router.post('/comments', commentsControllers.saveComment);
router.get('/comments/:id', commentsControllers.getComment);
// router.put('/comments/like', commentsControllers.like);
router.delete('/comments', auth, commentsControllers.deleteComment);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/google'}),
    (req, res) => {
        console.log(req);
        res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user))
    });


router.put('/user/basket', auth, (req, res) => {
    if (req.payload.role === 'admin' || req.payload.role === 'user') {
        return userControllers.addProductToBasket(req, res)
    } else if (req.payload.role === 'userBlocked') {
        return userControllers.getUserBlocked(req, res)
    }
});
router.post('/comments', auth, (req, res) => {
    if (req.payload.role === 'admin' || req.payload.role === 'user') {
        return commentsControllers.saveComment(req, res)
    } else if (req.payload.role === 'userBlocked') {
        return userControllers.getUserBlocked(req, res)
    }
});


module.exports = router;
