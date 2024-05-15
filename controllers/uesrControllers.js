import { catchAsyncError } from "../middlewares/catch.AsyncError.js";
import ErrorHandler from "../middlewares/errorHandler.js";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, role, password } = req.body;


  if (!name || !email || !phone || !role || !password) {
    return next(new ErrorHandler("all fields are required"))
  }

  const isEmailTaken = await User.findOne({ email });
  if (isEmailTaken) {
    return next(
      new ErrorHandler(
        "The email address is already in use. Please use a different email address."
      )
    );
  }

  const user = await User.create({ name, email, phone, role, password });

  sendToken(user, 200, res, "userRegister Successfully");
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("please provide email password and role"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid email or password"));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email or Password"));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("please provide role"));
  }

  sendToken(user, 200, res, "user login successfully");
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly:true,
      secure:true,
      sameSite:'None'
    })
    .json({
      success: true,
      message: "user logout successfully",
    });
});

export const getUser = catchAsyncError((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
