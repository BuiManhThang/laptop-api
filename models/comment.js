const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    text: {type: String, required: true},
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    dislikes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Comment', commentSchema);