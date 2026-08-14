const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

export default errorHandler;