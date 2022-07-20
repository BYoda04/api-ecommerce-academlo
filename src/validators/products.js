const { body, check, validationResult } = require('express-validator');
const { Categories } = require('../models/categories');

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
    const { categoryId } = req.body;
	const ext = ['jpg','jpeg','png','gif','tiff','psd','bmp','webp'];

	if (!req.files.length) {
		return next(new AppError('Products need a picture',404));
	};

	req.files.map(img=>{
		const imgExt = img.originalname.split('.').pop();
		if (!ext.includes(imgExt)) {
			return next(new AppError(`Invalid format ${imgExt}`,404));
		};
	});

    const category = await Categories.findOne({
        where: {
            id: categoryId,
            status: 'active'
        }
    });

    if (!category) {
        return next(new AppError('Categorie dont exist',404));
    };

    next();
};

const productValidator = [
	body('title').notEmpty().withMessage('Title cannot be empty'),
	body('description').notEmpty().withMessage('Description cannot be empty'),
	body('price').isInt().withMessage('Price must be an integer'),
	body('categoryId').isInt().withMessage('Categrie mus be an integer'),
	body('quantity').isInt().withMessage('Quantity must be an integer'),
	checkResult,
    checkParameters,
];

module.exports = { productValidator };