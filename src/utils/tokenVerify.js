const jwt = require('jsonwebtoken');

//models
const { Users } = require("../models/users");

//utils
const { AppError } = require("./appError");
const { catchAsync } = require("./catchAsync");

const verifyToken = catchAsync(async (req,res,next)=>{
		let token;

		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(" ")[1];
		};

		if (!token) {
			return next(new AppError('Invalid token', 403))
		}

		const decoded = jwt.verify(token, process.env.JWT_SIGN);

		const user = await Users.findOne({
			where: {
				id: decoded.id,
				status: 'active'
			}
		});

		if (!user) {
			return next(new AppError('The owner this token doesnt exist anymore',403))
		};

		req.userSession = {
			id: user.id,
			role: user.role,
			name: user.name
		};

		next()
	}
);

const onlyAdmin = catchAsync(async (req,res,next)=>{
	const { userSession } = req;

	if (userSession.role !== 'admin') {
		return next(new AppError('You dont have permission',403));
	};

	next()
});

const onlyOwner = catchAsync(async (req,res,next)=>{
	const { user,userSession } = req;

    if (user.id !== userSession.id) {
        return next(new AppError('You dont owner this account',404))
    }

	next()
})

module.exports = { 
	verifyToken,
	onlyAdmin,
	onlyOwner,
};