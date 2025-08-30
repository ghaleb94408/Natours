const fs = require("fs");
const express = require("express");
const qs = require("qs");
const mongoose = require("mongoose");
const morgan = require("morgan");
const AppError = require("./utils/appError");

const userRouter = require("./routers/userRoutes");
const tourRouter = require("./routers/tourRoutes");
const globalErrorHandler = require("./controller/errorController");

const tours = JSON.parse(
  fs.readFileSync("./dev-data/data/tours.json", "utf-8")
);

const app = express();
app.use(express.json());
app.set("query parser", (str) => qs.parse(str));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.all("/{*any}", (req, res, next) => {
  const err = new AppError(
    `The path ${req.originalUrl} doesn't exist on this server`,
    404
  );
  next(err);
});
app.use(globalErrorHandler);

module.exports = app;
