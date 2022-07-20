const express = require('express');

//controllers
const { deleted } = require('../controllers/productsInCart');

//validators

//utils
const { verifyToken } = require('../utils/tokenVerify');

//middleware
const { cartExists } = require('../middlewares/carts');
const { productInCartExists } = require('../middlewares/productsInCart');

const productsInCartRouter = express.Router();

//htttp://localhost:port/api/v1/products GET,POST,DELET,PUT
productsInCartRouter.delete("/:productId", verifyToken, cartExists, productInCartExists,deleted);

module.exports = { productsInCartRouter };