const express = require('express');

//controllers
const { create, update, getItems, purchased } = require('../controllers/carts');

//validators
const { cartValidator } = require('../validators/carts');

//utils
const { verifyToken } = require('../utils/tokenVerify');

//middleware
const { cartExists } = require('../middlewares/carts');

const cartsRouter = express.Router();

//htttp://localhost:port/api/v1/products GET,POST,DELET,PUT
cartsRouter.post("/add-product", verifyToken, cartValidator,create);
cartsRouter.patch("/update-cart", verifyToken, cartValidator, cartExists,update);
cartsRouter.get("/", verifyToken, cartExists,getItems);
cartsRouter.post("/purchase", verifyToken, cartExists,purchased);

module.exports = { cartsRouter };