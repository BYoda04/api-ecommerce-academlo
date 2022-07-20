const { body, validationResult } = require('express-validator');
const { Products } = require('../models/products');

//utils
const { AppError } = require('../utils/appError');

const checkResult = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// Array has errors
		const errorMsgs = errors.array().map(err => err.msg);

		const message = errorMsgs.join('. ');

		return next(new AppError(message, 400));
	}

	next();
};

const checkParameters =async (req,res,next)=>{
    const { productId,quantity } = req.body;

    const product = await Products.findOne({
        where: {
            id: productId,
            status: 'active'
        }
    });

    if (!product) {
        return next(new AppError('Product dont exists',404));
    };

    if ((parseInt(quantity) > product.quantity) || (parseInt(quantity) < 0)) {
        return next(new AppError(`There are only ${product.quantity} items of ${product.title}`,404));
    };

    next();
}

const cartValidator = [
	body('productId').isInt().withMessage('Product Id must be a number'),
	body('quantity').isInt().withMessage('Quantit must be an integer'),
	checkResult,
    checkParameters,
];

module.exports = { cartValidator };