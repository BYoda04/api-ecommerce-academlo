//models
const { Carts } = require("../models/carts");
const { Categories } = require("../models/categories");
const { Orders } = require("../models/orders");
const { Products } = require("../models/products");
const { ProductsInCart } = require("../models/productsInCart");
const { Users } = require("../models/users");

//utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const orderExists = catchAsync(async (req,res,next)=>{
    const { userSession } = req;
    const { id } = req.params;

    const order = await Orders.findOne({
        where: {
            id,
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

    if (!order) {
        return next(new AppError('Order not found',404));
    };

    req.order = order;

    next();
})

module.exports = { orderExists };