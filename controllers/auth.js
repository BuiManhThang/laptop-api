const jwt = require('jsonwebtoken');

exports.authorization = async (req, res, next) => {
    try {
        if(!req.cookies.jwt) {
            return res.json({errors: [{param: 'none', msg: 'none'}]});
        }
        const decoded = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
        req.body.userId = decoded._id;
        return next();
    } catch(err) {
        res.status(501).json(err);
    }
}