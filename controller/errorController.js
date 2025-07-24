const sendErrorDev = function (res, err) {
  res.status(err.statusCode).json({
    status: err.satus,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = function (res, err) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.satus,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong...",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(res, err);
  }
};
