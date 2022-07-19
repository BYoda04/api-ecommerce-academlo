const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//models
const { Users } = require('../models/users');
const { Products } = require('../models/products');

//utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { Categories } = require('../models/categories');

//controllers
const signUp = catchAsync(async (req,res,next)=>{
    const { name,email,password } = req.body;

    const salt = await bcrypt.genSalt(12);
    const encryptPass = await bcrypt.hash(password,salt);

    const newUser = await Users.create({
        name,
        email,
        password: encryptPass
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        newUser
    });
});

const login = catchAsync(async (req,res,next)=>{
    const { email, password } = req.body;

    const user = await Users.findOne({
        where:{
            email,
            status:'active'
        }
    });

    if (!user) {
        return next(new AppError('User not exist',404));
    };

    const validPass = await bcrypt.compare(password,user.password);

    if (!validPass) {
        return next(new AppError('Invalid password',404));
    };

    const token = jwt.sign({ 
        id: user.id,
    },process.env.JWT_SIGN,{
        expiresIn:'24h',
    });

    res.status(200).json({
        status:'succes',
        token
    })
})

const update = catchAsync(async (req,res,next)=>{
    const { user } = req;
    const { name,email } = req.body;

    if (name) {
        await user.update({ name });
    };

    if (email) {
        if (!email.includes("@")) {
            return next(new AppError('Must provide a valid email',404));
        };
        
        await user.update({ email });
    };

    res.status(201).json({ status: 'success' });
})

const deleted = catchAsync(async (req,res,next)=>{
    const { user } = req;

    await user.update({ status: 'delete' });

    res.status(201).json({ status: 'success' });
});

const getMe = catchAsync(async (req,res,next)=>{
    const { userSession } = req;

    const data = await Products.findAll({
        where: {
            userId: userSession.id,
            status: 'active'
        },
        include: [
            {
                model: Categories,
                required: false,
                where: {
                    status: 'active'
                },
                attributes: { exclude: ['status'] }
            },
        ],
        attributes: { exclude: ['categoryId','userId','status'] }
    });

    if (!data.length) {
        return next(new AppError('You dont have products create',404));
    };

    res.status(200).json({
        status: 'success',
        data
    })
})

module.exports = {
    signUp,
    login,
    update,
    deleted,
    getMe,
};