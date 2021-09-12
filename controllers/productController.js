const Product = require('../models/product');
const User = require('../models/user');
const Manufacturer = require('../models/manufacturer');
const Class = require('../models/class');
const {body, validationResult} = require('express-validator');

exports.product_list = async (req, res) => {
    try {
        const {manufacturer, classes, price, page, search, sort} = req.query;
        const query = {};
        const sortBy = {};
        if(manufacturer) {
            query.manufacturer = manufacturer;
        }
        if(classes) {
            query.class = classes;
        }
        if(price) {
            if(price === 'high') {
                query.price = {$gt: 1000};
            } else {
                query.price = {$lt: 1000};
            }
        }
        if(search) {
            query.name = {$regex: '.*' + search + '.*', $options: 'i'};
        }
        if(sort) {
            const filed = sort.split('-')[0];
            const direction = sort.split('-')[1];
            sortBy[filed] = direction;
        } else {
            sortBy.name = 'asc';
        }
        const [products, pages] = await Promise.all([
            // Product.find(query).limit(page * 4).skip((page - 1) * 4),
            Product.find(query).sort(sortBy).skip((page-1) * 12).limit(12),
            Product.find(query).countDocuments()
        ]) 
        if(!products) {
            return res.status(404).json({message: 'Product not found'});
        }
        const pagesResult = pages % 12 === 0 ? pages / 12 : parseInt((pages / 12) + 1);
        res.json({products, pages: pagesResult});
    } catch(err) {
        res.status(501).json(err);
    }
}

exports.product_detail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    } catch(err) {
        res.status(501).json(err);
    }
}

exports.product_search = async (req, res) => {
    try {
        const query = req.query.product;
        const products = await Product.find({name: {$regex: '.*' + query + '.*', $options: 'i'}}).limit(4);
        res.json(products);
    } catch(err) {
        res.status(501).json(err);
    }
}

exports.product_create = [
    body('name').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('price').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('cpuName').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('cpuCores').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('cpuThreads').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('cpuBaseFreq').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('cpuMaxFreq').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('gpuName').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('ramSize').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('ramType').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('romType').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('romSize').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('ramMaxSp').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('ramBusSpeed').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('battery').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('sizeWidth').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('sizeLength').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('sizeThickness').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('quantity').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('sale').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('screenSize').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('screenSizeX').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('screenSizeY').trim().isLength({min: 1}).withMessage('This field is required').escape(),
    body('screenFreq').trim().isLength({min: 1}).withMessage('This field is required').escape(),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.json({errors: errors.array()});
            }
            const user = await User.findById(req.body.userId);
            if(!user.isAdmin) {
                return res.status(401).json({message: 'you dont have permission'})
            }

            const imgs = req.files.map(file => {
                return file.filename;
            })

            const product = new Product({
                name: req.body.name,
                price: req.body.price,
                cpu: {
                    name: req.body.cpuName,
                    cores: req.body.cpuCores,
                    threads: req.body.cpuThreads,
                    cache: req.body.cpuCache,
                    base_frequency: req.body.cpuBaseFreq,
                    max_frequency: req.body.cpuMaxFreq
                },
                gpu: req.body.gpuName,
                ram: {
                    size: req.body.ramSize,
                    type: req.body.ramType,
                    bus_speed: req.body.ramBusSpeed,
                    max_support: req.body.ramMaxSp
                },
                battery: req.body.battery,
                size: {
                    width: req.body.sizeWidth,
                    length: req.body.sizeLength,
                    thickness: req.body.sizeThickness,
                },
                rom: {
                    size: req.body.romSize,
                    type: req.body.romType,
                },
                quantity: req.body.quantity,
                sale: req.body.sale,
                screen: {
                    size: req.body.screenSize,
                    resolution: {
                        x: req.body.screenSizeX,
                        y: req.body.screenSizeY
                    },
                    frequency: req.body.screenFreq
                },
                manufacturer: req.body.manufacturer,
                class: req.body.classes,
                imgs: imgs
            });

            const newProduct = await product.save();
            await Manufacturer.updateOne({_id: req.body.manufacturer}, {$push: {products: newProduct._id}});
            await Class.updateOne({_id: req.body.classes}, {$push: {products: newProduct._id}});
            res.json(newProduct);
        } catch(err) {
            return res.status(501).json(err);
        }
    }
]