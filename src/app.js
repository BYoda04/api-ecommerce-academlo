require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();

//Routers
const { usersRouter } = require('./routes/users.routes');
const { categoriesRouter } = require('./routes/categories.routes');
const { productsRouter } = require('./routes/products.routes');
const { cartsRouter } = require('./routes/carts.routes');
const { productsInCartRouter } = require('./routes/productsIncart.routes');
const { ordersRouter } = require('./routes/orders.routes');

//utils
const { globalErrorHandler } = require('./utils/globarError');
const { AppError } = require('./utils/appError');

app.use(cors());
app.use(express.json());

//set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//limiter
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000, //1hr
    message: 'Number of requests have been exceded'
});

app.use(limiter);

//security headers
app.use(helmet());

//compress response
app.use(compression());

//log incoming requests
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

//invocate routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/users", ordersRouter);
app.use("/api/v1/products", categoriesRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartsRouter);
app.use("/api/v1/cart", productsInCartRouter);

app.all('*',(req,res,next)=>{
    next(
        new AppError(
			`${req.method} ${req.originalUrl} not found in this server`,
			404
        )
    );
});

app.use(globalErrorHandler);

module.exports = { app };