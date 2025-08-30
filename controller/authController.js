const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { decode } = require("punycode");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: { userName: newUser.name, email: newUser.email },
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Check if email and password exist
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("please provide email and password", 400));
  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct)
    return next(new AppError("email and password do not match", 401));
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new AppError(
        "You are not logged in, please log in to access the Data",
        401
      )
    );
  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(new AppError("This user does no longer exist", 401));
  console.log(freshUser);
  //check if user has changed his password after login
  if (freshUser.changedPasswordAfterLogin(decoded.iat))
    return next(new AppError("please log in again", 401));
  req.user = freshUser;
  next();
});
