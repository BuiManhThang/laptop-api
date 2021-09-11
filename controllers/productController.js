const Product = require('../models/product');

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