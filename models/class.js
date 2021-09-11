const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: {type: String, required: true, maxlength: 80},
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
})

module.exports = mongoose.model('Class', classSchema);