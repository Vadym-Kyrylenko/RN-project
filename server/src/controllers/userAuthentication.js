const passport = require('passport');
const services = require('../services');
const User = require('../models').User;


let sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.registerUser = function (req, res) {

    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required (register)"
        });
        return;
    }

    let user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;

    user.setPassword(req.body.password);

    user.save(function (err) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
        } else {
            services.avatar.postAvatar(user._id, '');
            sendJSONresponse(res, 200, {
                success: true, status: 7
            });
        }
    });
};

module.exports.loginUser = function (req, res) {

    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required (login)"
        });
        return;
    }

    passport.authenticate('local', function (err, user, info) {
        let token;
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }
        if (user) {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                'token': token,
                user: {
                    role: user.role,
                    // wishList: user.wishList,
                    basket: user.basket,
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    city: user.city
                }
            });
        } else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};
