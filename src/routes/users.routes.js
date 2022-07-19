const express = require('express');

//controllers
const { signUp, login, update, deleted, getMe } = require('../controllers/users');

//validators
const { userValidator } = require('../validators/users');

//utils
const { verifyToken, onlyOwner } = require('../utils/tokenVerify');

//middleware
const { userExists } = require('../middlewares/users');

const usersRouter = express.Router();

//htttp://localhost:port/api/v1/user GET,POST,DELET,PUT
usersRouter.post("/signup", userValidator,signUp);
usersRouter.post("/login",login);
usersRouter.patch("/:id", verifyToken, userExists, onlyOwner,update);
usersRouter.delete("/:id", verifyToken, userExists, onlyOwner,deleted);
usersRouter.get("/me", verifyToken,getMe);

module.exports = { usersRouter };