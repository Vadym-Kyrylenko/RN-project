const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({

    firstName: {
        type: String, required: true
    },
    lastName: {
        type: String, required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },

    role: {type: String, enum: ['admin', 'user', 'userBlocked'], default: 'user'},
    city: {type: String},
    basket: {type: [String]},

    googleId: {type: String},

    hash: {type: String},
    salt: String
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
