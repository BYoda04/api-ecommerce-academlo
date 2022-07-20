//models
const { Categories } = require("../models/categories");
const { Products } = require("../models/products");
const { ProductsImgs } = require("../models/productsImg");
const { Users } = require("../models/users");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const productExists = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const product = await Products.findOne({
        where: {
            id,
            status:'active'
        },
        include: [
            {
                model: Users,
                required: false,
                where: {
                    status: 'active'
                },
                attributes: { exclude: ['password','status'] }
            },
            {
                model: Categories,
                required: false,
                where: {
                    status: 'active'
                },
                attributes: { exclude:'status' }
            },
            {
                model: ProductsImgs,
                required: false,
                where: {
                    status: 'active'
                },
                attributes: { exclude: ['productId','status'] }
            }
        ]
    });

    if (!product) {
        return next(new AppError('Product not found',404));
    };

    req.product = product;
    req.user = {
        id: product.userId
    };

    next();
});

module.exports = { productExists };