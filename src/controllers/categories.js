//models
const { Categories } = require("../models/categories");

//utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

//controllers
const create = catchAsync(async (req,res,next)=>{
    const { name } = req.body;

    const newCategorie = await Categories.create({
        name
    });

    res.status(201).json({
        status: 'success',
        newCategorie
    });
});

const update = catchAsync(async (req,res,next)=>{
    const { categorie } = req;
    const { name } = req.body;

    if (name) {
        await categorie.update({
            name
        });
    };

    res.status(200).json({
        status: 'success'
    });
});

const getItems = catchAsync(async (req,res,next)=>{
    const data = await Categories.findAll({
        where:{
            status: 'active'
        },
        attributes: { exclude:'status' }
    });

    if (!data.length) {
        return next(new AppError('There are no existing categories',404));
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

module.exports = {
    create,
    update,
    getItems,
};