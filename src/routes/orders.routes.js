const express = require('express');

//controllers
const { getOrders, getOrder } = require('../controllers/orders');

//validators

//utils
const { verifyToken } = require('../utils/tokenVerify');

//middleware
const { orderExists } = require('../middlewares/orders');

const ordersRouter = express.Router();

//htttp://localhost:port/api/v1/user GET,POST,DELET,PUT
ordersRouter.get("/orders", verifyToken,getOrders);
ordersRouter.get("/orders/:id", verifyToken, orderExists,getOrder);

module.exports = { ordersRouter };