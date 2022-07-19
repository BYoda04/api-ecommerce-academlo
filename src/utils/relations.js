//models
const { Users } = require("../models/users");
const { Orders } = require("../models/orders");
const { Products } = require("../models/products");
const { ProductsImgs } = require("../models/productsImg");
const { Categories } = require("../models/categories");
const { Carts } = require("../models/carts");
const { ProductsInCart } = require("../models/productsInCart");


const relations = ()=>{

    //hasMany
        //users
        Users.hasMany(Orders,{ foreignKey:'userId' });
        Users.hasMany(Products,{ foreignKey:'userId' });
        //products
        Products.hasMany(ProductsImgs,{ foreignKey:'productId' });
        //carts
        Carts.hasMany(ProductsInCart,{ foreignKey:'cartId' });

    //hasOne
        //users
        Users.hasOne(Carts,{ foreignKey:'userId' });
        //carts
        Carts.hasOne(Orders,{ foreignKey:'cartId' });
        //categorys
        Categories.hasOne(Products,{ foreignKey:'categoryId' });
        //products
        Products.hasOne(ProductsInCart,{ foreignKey:'productId' });

    //belongsTo
        //products
        Products.belongsTo(Users);
        Products.belongsTo(Categories);
        //orders
        Orders.belongsTo(Users);
        Orders.belongsTo(Carts);
        //productsImgs
        ProductsImgs.belongsTo(Products);
        //productsIncart
        ProductsInCart.belongsTo(Carts);
        ProductsInCart.belongsTo(Products);
        //carts
        Carts.belongsTo(Users);
};

module.exports = { relations };