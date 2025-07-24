const { default: mongoose } = require("mongoose");
const Tour = require("../model/tourModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CHECK IF ID EXISTS
exports.checkID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exist = await Tour.exists({ _id: id });
  const err = new AppError("The required Tour was not found", 404);
  if (!exist) next(err);
  next();
});
// CRUD OPERATIONS
exports.getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .limitResults();
  const query = features.query;
  const tours = await query;
  const numResults = tours.length;
  res.status(200).json({
    status: "OK",
    results: numResults,
    tours,
  });
});
exports.getTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  res.status(200).json({
    status: "OK",
    tour,
  });
});
exports.createTour = catchAsync(async (req, res) => {
  const newTour = req.body;
  const createdTour = await Tour.insertOne(newTour);
  res.status(200).json({
    status: "OK",
    createdTour,
  });
});
exports.updateTour = catchAsync(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const modifiedTour = await Tour.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "OK",
    tour: modifiedTour,
  });
});
exports.deleteTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Tour.findByIdAndDelete(id);
  res.status(204).json({
    status: "ok",
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
  ]);
  res.status(200).json({
    status: "OK",
    stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "OK",
    numResults: plan.length,
    plan,
  });
});
