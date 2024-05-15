import { catchAsyncError } from "../middlewares/catch.AsyncError.js";
import ErrorHandler from "../middlewares/errorHandler.js";
import { Job } from "../models/job.model.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "job seeker") {
    return next(new ErrorHandler("you are not atherized to post jobs", 400));
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("please full all field"));
  }

  if (!fixedSalary && (!salaryFrom || !salaryTo)) {
    return next(new ErrorHandler("please provide salary details"));
  }

  if (fixedSalary && salaryFrom && salaryTo) {
    return next(new ErrorHandler("please provide range or fixed salary"));
  }

  const postedBy = req.user._id;

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  res.status(200).json({
    success: true,
    message: "job created successfully",
    job,
  });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "job seeker") {
    return next(new ErrorHandler("you have not jobs", 400));
  }
  const myJobs = await Job.find({ postedBy: req.user._id });

  res.status(200).json({ success: true, myJobs });
});

export const updateJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "job seeker") {
    return next(new ErrorHandler("You have no jobs", 400));
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops job not found", 404));
  }

  job = await Job.findByIdAndUpdate(id, req.body, {

    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    job,
  });
});

export const deleteJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "job seeker") {
    return next(new ErrorHandler("You have no jobs", 400));
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops job not found", 404));
  }

  job = await Job.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
    job,
  });
});


export const jobDetails = catchAsyncError(async (req, res, next)=>{
  const { id } = req.params;
  let job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Oops job not found", 404));
  }
  res.status(200).json({
    success: true,
    job,
  });
})