const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatarSchema = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    avatarData: {
        type: Buffer,
    }
});

const Avatar = mongoose.model('Avatar', avatarSchema);
module.exports = Avatar;
