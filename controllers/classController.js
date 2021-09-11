const Class = require('../models/class');

exports.class_list = async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);
    } catch(err) {
        res.status(501).json(err);
    }
}