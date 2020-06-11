const userRepository = require('../repositories/userRepository');
const avatarRepository = require('../repositories/avatarRepository');
const msg = require('../i18n/en').msg;
const nodemailer = require('nodemailer');

module.exports.getUser = (id) => {
    return userRepository.findUser(id).then(resUser => {
        return {
            role: resUser.role,
            basket: resUser.basket,
            _id: resUser._id,
            firstName: resUser.firstName,
            lastName: resUser.lastName,
            email: resUser.email,
            city: resUser.city
        }
    });
};

module.exports.getUsers = () => {
    return userRepository.findUsers()
};

module.exports.putUser = async (id, body) => {
    const {firstName, lastName, city} = body;
    let newUser = {firstName, lastName, city,};

    return await userRepository.updateUser(id, newUser).then(resUser => {
        return {
            role: resUser.role,
            basket: resUser.basket,
            _id: resUser._id,
            firstName: resUser.firstName,
            lastName: resUser.lastName,
            email: resUser.email,
            city: resUser.city
        }
    });
};

module.exports.deleteUser = async (id) => {
    return await avatarRepository.findAvatar(id).then(avatar => {
        return avatarRepository.deleteAvatar(avatar._id).then(() => {
            return userRepository.deleteUser(id)
                .then(() => {
                    return msg.userDeleted
                }).catch((err) => {
                    console.log(err);
                    return msg.error
                })
        }).catch(() => {
            avatarRepository.postAvatar(avatar);
            return msg.errorOnRemoveUser
        })
    }).catch(() => {
        return msg.errorOnRemoveAvatar
    })
};

module.exports.addProductToBasket = async (id, body) => {
    let product = body.productId;
    return await userRepository.findUser(id).then(async user => {
            if (user.basket.length > 0) {
                const p = await user.basket.filter(item => item !== body.productId);
                user.basket.length = 0;
                if (p.length > 0) {
                    user.basket.push(...p, product)

                } else {
                    await user.basket.push(product);
                }
                return await userRepository.updateUser(user._id, user);
            } else {
                user.basket.push(product);
                return await userRepository.updateUser(user._id, user);
            }

        }
    );
};

module.exports.delProductFromBasket = async (id, body) => {
    return await userRepository.findUser(id).then(async user => {
            if (user.basket.length > 0) {
                const p = await user.basket.filter(item => item !== body.productId);
                user.basket.length = 0;
                user.basket.push(...p);
                return await userRepository.updateUser(user._id, user);
            }
        }
    );
};

module.exports.changePassword = async (id, body) => {
    const {lastPassword, newPassword, repeatNewPassword} = body;

    return await userRepository.findUser(id).then(async (user) => {
        if (newPassword !== repeatNewPassword) {
            return {status: 1, message: 'New password and repeat new password do not match'}
        } else {
            if (user.validPassword(lastPassword)) {
                await user.setPassword(newPassword);
                await user.save();
                return {status: 0, message: 'Password successfully changed'}
            } else {
                return {status: 2, message: 'Not correct last password'}
            }
        }

    });
};

module.exports.putUserForAdmin = async (id, body) => {
    const {firstName, lastName, role, city} = body;
    let newUser = {firstName, lastName, city, role};

    return await userRepository.updateUser(id, newUser).then(resUser => {
        return {
            role: resUser.role,
            basket: resUser.basket,
            _id: resUser._id,
            firstName: resUser.firstName,
            lastName: resUser.lastName,
            email: resUser.email,
            city: resUser.city
        }
    });
};

module.exports.forgotPassword = (email) => {
    return userRepository.findUserEmail(email).then(
        (user) => new Promise((resolve, reject) => {
            if (user === null) return resolve({status: 403, message: msg.emailNotInDb});

            const newPassword = Math.random().toString(36).substr(2, 5);
            user.setPassword(newPassword);
            user.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: `${user.email}`,
                subject: 'New Password',
                text:
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                    + `New password = ${newPassword}\n\n`
            };
            console.log('Sending mail');
            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('there was an error: ', err);
                    return reject(err)
                } else {
                    console.log('here is the res: ', response);
                    return resolve({status: 8, message: msg.NewPasswordSent});
                }
            });
        })
    )
};


