const Receipt = require('../models/receipt');
const User = require('../models/user');

exports.receipt_create = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if(!user) {
            return res.json({errors: [{param: 'none', msg: 'none'}]});
        }
        const receipt = new Receipt({
            user: user._id,
            products: req.body.products,
            payment: req.body.payment
        })
        await User.updateOne({_id: user._id}, {$push: {receipts: user._id}});
        const theReceipt = await receipt.save();
        res.json(theReceipt);
    } catch(err) {
        res.status(501).json(err); 
    }
}

exports.receipt_list = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if(!user) {
            return res.json({errors: [{param: 'none', msg: 'none'}]});
        }
        const receipts = await Receipt.find({user: req.params.user}).populate('user').populate('products.product').sort({date: -1});
        res.json(receipts);
    } catch(err) {
        res.status(501).json(err); 
    }
}