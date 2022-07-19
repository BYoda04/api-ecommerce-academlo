const { ref } = require("firebase/storage");

//models
const { Products } = require("../models/products");
const { Users } = require("../models/users");
const { Categories } = require("../models/categories");

//utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const { storage } = require("../utils/firebase.config");

//controllers
const create = catchAsync(async (req,res,next)=>{
    const { userSession } = req;
    const { title,description,price,categoryId,quantity } = req.body;

    // const newProduct = await Products.create({
    //     title,
    //     description,
    //     price,
    //     categoryId,
    //     quantity,
    //     userId: userSession.id
    // });

    if (req.files.length) {
        const promises = req.files.map(async file=>{
            const ext = file.originalname.split('.').pop();
            const ref = ref(storage, `productsImgs/${userSession.name}/file-${Date.now()}.${ext}`)
        });
    }

    // const user = await Users.findOne({
    //     where: {
    //         id: userSession.id,
    //         status: 'active'
    //     }
    // });

    // await user.update({
    //     role: 'admin'
    // });

    // res.status(201).json({
    //     status: 'success',
    //     newProduct
    // });
});

const update = catchAsync(async (req,res,next)=>{
    const { product } = req;
    const { title,description,price,quantity } = req.body;

    if (title) {
        await product.update({
            title
        });
    };

    if (description) {
        await product.update({
            description
        });
    };

    if (price) {
        await product.update({
            price
        });
    };

    if (quantity) {
        await product.update({
            quantity
        });
    };

    res.status(200).json({
        status: 'success'
    });
});

const deleted = catchAsync(async (req,res,next)=>{
    const { product } = req;

    await product.update({
        status: 'delete'
    })

    res.status(200).json({
        status: 'success'
    });
});

const getItems = catchAsync(async (req,res,next)=>{
    const data = await Products.findAll({
        where: {
            status: 'active'
        },
        include: [
            {
                model: Categories,
                required: false,
                where: {
                    status: 'active'
                },
                attributes: { exclude:'status' }
            },
            {
                model: Users,
                required: false,
                where: {
                    status: 'active'
                },
                attributes: { exclude: ['password','status'] }
            }
        ],
        attributes: { exclude: ['categoryId','userId','status'] }
    });

    if (!data.length) {
        return next(new AppError('Products dont exists',404));
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

const getItem = catchAsync(async (req,res,next)=>{
    const { product } = req;

    product.categoryId = undefined;
    product.userId = undefined;
    product.status = undefined;

    res.status(200).json({
        status: 'success',
        product
    });
});

module.exports = {
    create,
    update,
    deleted,
    getItems,
    getItem,
};