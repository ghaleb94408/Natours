const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
  console.log(token);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  next();
});
