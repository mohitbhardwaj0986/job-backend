class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "caseError") {
    const message = `resorce not found ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 11000);
  }

  if (err.name === "jsonWebTokenError") {
    const message = `json web token invalid`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "tokenExpireError") {
    const message = `json web token is expired`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
