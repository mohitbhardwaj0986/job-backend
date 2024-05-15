import { catchAsyncError } from "../middlewares/catch.AsyncError.js";
import { Job } from "../models/job.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Application } from "../models/applocation.model.js";
import ErrorHandler from "../middlewares/errorHandler.js";

export const employerGetAllApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "job seeker") {
      return next(new ErrorHandler("you are not autherized"));
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const applocantGetAllApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(new ErrorHandler("you are not autherized"));
    }

    const { _id } = req.user;
    const applications = await Application.find({ "applicantId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(new ErrorHandler("you are not autherized"));
    }

    const { id } = req.params;
    let application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("application not found"));
    }

    application = await Application.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "application deleted successfully",
    });
  }
);

export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("you are not autherized"));
  }
  const resumeLocalPath = req.files?.resume[0]?.path;
  if (!resumeLocalPath) {
    return next(new ErrorHandler("resume file is required"))
  }

const resume =  await uploadOnCloudinary(resumeLocalPath)

if (!resume) {
  return next(new ErrorHandler("resume is required"))
}


  const { name, email, coverLatter, phone, address, jobId } = req.body;

  const applicantId = {
    user: req.user._id,
    role: "job seeker",
  };

  if (!jobId) {
    return next(new ErrorHandler("job not found"));
  }

  const jobDetails = await Job.findById(jobId);

  if (!jobDetails) {
    return next(new ErrorHandler("job not found"));
  }

  const employerId = {
    user: jobDetails.postedBy,
    role: "Employer",
  };

  if (
    !name ||
    !email ||
    !coverLatter ||
    !phone ||
    !address ||
    !applicantId ||
    !employerId ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill in all the required fields."));
  }

  const application = await Application.create({
    name,
    email,
    coverLatter,
    phone,
    address,
    applicantId,
    employerId,
   resume: resume.url
  });
  res.status(200).json({
    success: true,
    message: "your application submit",
    application,
  });
});
