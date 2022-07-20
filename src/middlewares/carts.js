//models
const { Carts } = require("../models/carts");
const { Categories } = require("../models/categories");
const { Products } = require("../models/products");
const { ProductsInCart } = require("../models/productsInCart");
const { Users } = require("../models/users");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const cartExists = catchAsync(async (req,res,next)=>{
    const { userSession } = req;

    const cart = await Carts.findOne({
        where: {
            userId: userSession.id,
            status:'active'
        },
        include: [
            {
                model: ProductsInCart,
                include: {
                    model: Products,
                    include: [
                        {
                            model: Users,
                            required: false,
                            where: {
                                status: 'active'
                            },
                            attributes: { exclude: ['password','status','role'] }
                        },
                        {
                        model: Categories,
                        required: false,
                        where: {
                            status: 'active'
                        }
                        }
                    ],
                    required: false,
                    where: {
                        status: 'active'
                    },
                    attributes: { exclude: ['categoryId','userId','status'] }
                },
                required: false,
                where: {
                    status: 'active'
                },
                attributes: { exclude: ['cartId','productId','status'] }
            }
        ],
        attributes: { exclude: ['userId','status'] }
    });

    if (!cart) {
        return next(new AppError('User do not have an active cart',404));
    };

    req.cart = cart;

    next();
});

module.exports = { cartExists };