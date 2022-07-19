//models
const { Categories } = require("../models/categories");

//utils
const { AppError } = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const categorieExists = catchAsync(async (req,res,next)=>{
    const { id } = req.params;

    const categorie = await Categories.findOne({
        where: {
            id,
            status:'active'
        },
    });

    if (!categorie) {
        return next(new AppError('Categorie not found',404));
    };

    req.categorie = categorie;

    next();
});

module.exports = { categorieExists };