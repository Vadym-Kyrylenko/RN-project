const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId, ref: 'User', required: true
    },
    productId: {
        type: Schema.Types.ObjectId, ref: 'Product', required: true
    },
    createdAt: {type: Date, required: true},
    comment: {
        type: String, required: true
    },
    liked: {type: Boolean, enum: [true, false], default: false},
    reported: {type: Boolean, enum: [true, false], default: false},

    parentId: {type:Schema.Types.ObjectId, ref: 'Comment', default: null},
    likes: {
        type: Array
    },
    email: {
        type: String
    },
    children: {
        type: Array
    }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
