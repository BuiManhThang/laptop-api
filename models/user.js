const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, maxlength: 80, required: true},
    email: {type: String, maxlength: 200, required: true},
    password: {type: String, required: true},
    avata: {type: String, default: 'default-avata.jpg'},
    phone: {type: String, minlength: 10, maxlength: 10},
    address: {
        landmark: {type: String},
        city: {type: String},
    },
    receipts: [{type: Schema.Types.ObjectId, ref: 'Receipt'}],
    isAdmin: {type: Boolean, default: false}
})

module.exports = mongoose.model('User', userSchema);