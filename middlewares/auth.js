import jwt from "jsonwebtoken";
import ErrorHandler from "./errorHandler.js";
import { User } from "../models/user.model.js";
import { catchAsyncError } from "./catch.AsyncError.js";

export const isAuthorized = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return next(new ErrorHandler("Please login first", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();

  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
});
