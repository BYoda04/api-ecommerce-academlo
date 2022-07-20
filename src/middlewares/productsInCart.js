//models
const { ProductsInCart } = require("../models/productsInCart");

//utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const productInCartExists = catchAsync(async (req,res,next)=>{
    const { cart } = req;
    const { productId } = req.params;

    const productInCart = await ProductsInCart.findOne({
        where: {
            id: productId,
            cartId: cart.id,
            status: 'active'
        }
    });

    if (!productInCart) {
        return next(new AppError('Product in cart not found',404));
    };

    req.productInCart = productInCart;

    next();
});

module.exports = { productInCartExists };