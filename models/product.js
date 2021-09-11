const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true, maxlength: 80},
    manufacturer: {type: Schema.Types.ObjectId, ref: 'Manufacturer'},
    class: {type: Schema.Types.ObjectId, ref: 'Class'},
    price: {type: Number, required: true},
    imgs: [{type: String}],
    cpu: {
        name: {type: String, required: true, maxlength: 80},
        cores: {type: Number, required: true, min: 1},
        threads: {type: Number, required: true, min: 1},
        base_frequency: {type: Number, required: true},
        max_frequency: {type: Number, required: true},
        cache: {type: Number, required: true},
    },
    gpu: {type: String, default: 'Onboard', maxlength: 80},
    screen: {
        size: {type: Number, required: true},
        resolution: {
            x: {type: Number, required: true},
            y: {type: Number, required: true},
        },
        frequency: {type: Number, required: true},
    },
    ram: {
        size: {type: Number, required: true},
        type: {type: String, required: true, maxlength: 20},
        bus_speed: {type: Number, required: true},
        max_support: {type: Number, required: true}
    },
    rom: {
        size: {type: Number, required: true},
        type: {type: String, required: true}
    },
    battery: {type: Number, required: true},
    size: {
        width: {type: Number, required: true},
        length: {type: Number, required: true},
        thickness: {type: Number, required: true},
    },
    quantity: {type: Number, required: true, min: 0},
    sale: {type: Number, default: 0}
})

module.exports = mongoose.model('Product', productSchema);
