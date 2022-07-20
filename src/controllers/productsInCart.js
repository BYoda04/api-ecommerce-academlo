//models

//utils
const { catchAsync } = require("../utils/catchAsync");

//controllers
const deleted = catchAsync(async (req,res,next)=>{
    const { productInCart } = req;

    await productInCart.update({
        quantity: 0,
        status: 'removed'
    });

    res.status(200).json({
        status: 'success'
    });
});

module.exports = {
    deleted
};