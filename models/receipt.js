const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiptSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    products: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, required: true}
    }],
    payment: {type: String, required: true},
    date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Receipt', receiptSchema);