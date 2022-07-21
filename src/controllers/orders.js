//models
const { Carts } = require("../models/carts");
const { Categories } = require("../models/categories");
const { Orders } = require("../models/orders");
const { Products } = require("../models/products");
const { ProductsInCart } = require("../models/productsInCart");
const { Users } = require("../models/users");
const { AppError } = require("../utils/appError");

//utils
const { catchAsync } = require("../utils/catchAsync");

//controllers
const getOrders = catchAsync(async (req,res,next)=>{
    const { userSession } = req;

    const orders = await Orders.findAll({
        where: {
            userId: userSession.id,
            status: 'active'
        },
        include: [
            {
                model: Carts,
                include: {
                    model: ProductsInCart,
                    include: {
                        model: Products,
                        include: [
                            {
                                model: Users,
                                attributes: { exclude: ['password','role'] }
                            },
                            {
                                model: Categories,
                                attributes: { exclude: ['status'] }
                            }
                        ],
                        attributes: { exclude: ['categoryId','userId'] }
                    },
                    required: false,
                    where: {
                        status: 'purchased'
                    },
                    attributes: { exclude: ['cartId','productId','status'] }
                },
                required: false,
                where: {
                    status: 'purchased'
                },
                attributes: { exclude: ['userId','status'] }
            },
        ],
        attributes: { exclude: ['userId','cartid','status'] }
    });

    if (!orders.length) {
        return next(new AppError('You dont have orders',404));
    }

    res.status(200).json({
        status: 'success',
        orders
    });
});

const getOrder = catchAsync(async (req,res,next)=>{
    const { order } = req;

    res.status(200).json({
        status: 'success',
        order
    });
})

module.exports = {
    getOrders,
    getOrder,
};