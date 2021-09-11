const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const manufacturerSchema = new Schema({
    name: {type: String, required: true, maxlength: 80},
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
})

module.exports = mongoose.model('Manufacturer', manufacturerSchema);