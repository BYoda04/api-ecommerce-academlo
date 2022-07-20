const express = require('express');

//controllers
const { create, update, getItems } = require('../controllers/categories');

//validators
const { categorieValidator } = require('../validators/categories');

//utils
const { verifyToken } = require('../utils/tokenVerify');
const { categorieExists } = require('../middlewares/categories');

//middleware

const categoriesRouter = express.Router();

//htttp://localhost:port/api/v1/products GET,POST,DELET,PUT
categoriesRouter.post("/categories", verifyToken, categorieValidator,create);
categoriesRouter.patch("/categories/:id", verifyToken, categorieExists,update);
categoriesRouter.get("/categories",getItems);

module.exports = { categoriesRouter };