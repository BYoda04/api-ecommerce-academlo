//models
const { Carts } = require("../models/carts");
const { Orders } = require("../models/orders");
const { Products } = require("../models/products");
const { ProductsInCart } = require("../models/productsInCart");

//utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const { Email } = require("../utils/email");

//controllers
const create = catchAsync(async (req,res,next)=>{
    const { userSession } = req;
    const { productId,quantity } = req.body;

    if (parseInt(quantity) === 0) {
        return next(new AppError('The minimum quantity is one',404));
    };

    let cart = await Carts.findOne({
        where: {
            userId: userSession.id,
            status: 'active'
        }
    });

    if (!cart) {
        cart = await Carts.create({
            userId: userSession.id
        });
    };

    let product = await ProductsInCart.findOne({
        where: {
            cartId: cart.id,
            productId
        }
    });

    if (product) {
        if (product.status === 'active') {
            return next(new AppError('Product exists',404));
        } else if (product.status === 'removed') {
            product.update({
                quantity,
                status: 'active'
            });
        };
    } else {
        await ProductsInCart.create({
            cartId: cart.id,
            productId,
            quantity
        });
    };

    res.status(201).json({
        status: 'success',
        cart
    });
});

const update = catchAsync(async (req,res,next)=>{
    const { cart } = req;
    const { productId,quantity } = req.body;

    const productIncart = await ProductsInCart.findOne({
        where: {
            cartId: cart.id,
            productId,
            status: 'active'
        }
    });

    if (!productIncart) {
        return next(new AppError('Product not yet added',404));
    };

    if (parseInt(quantity) === 0) {
        productIncart.update({
            status: 'removed'
        });
    };

    productIncart.update({
        quantity: quantity
    });

    res.status(200).json({
        status: 'success'
    });
});

const getItems = catchAsync(async (req,res,next)=>{
    const { cart } = req;

    res.status(200).json({
        status: 'success',
        cart
    })
});

const purchased = catchAsync(async (req,res,next)=>{
    const { userSession } = req;
    const { cart } = req;

    let totalPrice = 0

    const promises = cart.productsInCarts.map(async productInCart=>{
        const product = await Products.findOne({
            where: {
                id: productInCart.product.id
            }
        });

        await product.update({
            quantity: product.quantity - productInCart.quantity
        });

        await productInCart.update({
            status: 'purchased'
        });

        totalPrice += productInCart.quantity * product.price
    });

    await Promise.all(promises);

    await cart.update({
        status: 'purchased'
    });

    const newOrder = await Orders.create({
        userId: userSession.id,
        cartId: cart.id,
        totalPrice
    });

    const order = await Orders.findOne({
        where: {
            id: newOrder.id
        },
        include: [
            {
                model: Carts,
                include: {
                    model: ProductsInCart,
                    include: {
                        model: Products,
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

    //send mail
    await new Email(userSession.email).sendSales(order);

    res.status(200).json({
        status: 'success',
    });
})

module.exports = {
    create,
    update,
    getItems,
    purchased,
};