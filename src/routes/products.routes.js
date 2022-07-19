const express = require('express');

//controllers
const { create, update, deleted, getItems, getItem } = require('../controllers/products');

//validators
const { productValidator } = require('../validators/products');

//utils
const { verifyToken, onlyAdmin, onlyOwner } = require('../utils/tokenVerify');
const { upload } = require('../utils/upload');

//middleware
const { productExists } = require('../middlewares/products');

const productsRouter = express.Router();

//htttp://localhost:port/api/v1/products GET,POST,DELET,PUT
productsRouter.post("/", verifyToken, upload.array("img",5), productValidator,create);
productsRouter.patch("/:id", verifyToken, onlyAdmin, productExists, onlyOwner,update);
productsRouter.delete("/:id", verifyToken, onlyAdmin, productExists, onlyOwner,deleted);
productsRouter.get("/",getItems);
productsRouter.get("/:id", productExists,getItem);

module.exports = { productsRouter };