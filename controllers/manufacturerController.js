const Manufacturer = require("../models/manufacturer");

exports.list = async (req, res) => {
    try {
        const manufacturerList = await Manufacturer.find({});
        res.json(manufacturerList);
    } catch(err) {
        res.status(501).json(err);
    }
}