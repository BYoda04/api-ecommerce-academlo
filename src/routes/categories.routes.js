const express = require('express');

//controllers
const { create, update, getItems } = require('../controllers/categories');

//validators
const { categorieValidator } = require('../validators/categories');

//utils
const { verifyToken } = require('../utils/tokenVerify');
const { categorieExists } = require('../middlewares/categories');

//middleware

const categoriessRouter = express.Router();

//htttp://localhost:port/api/v1/products GET,POST,DELET,PUT
categoriessRouter.post("/categories", verifyToken, categorieValidator,create);
categoriessRouter.patch("/categories/:id", verifyToken, categorieExists,update);
categoriessRouter.get("/categories",getItems);

module.exports = { categoriessRouter };