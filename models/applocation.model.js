import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validator: [validator.isEmail],
    unique: true,
  },
  coverLatter: {
    type: String,
    requird: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  resume: {
   type: String, // cloudinary url
   required:true
  },
  applicantId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      required: true,
      enum: ["job seeker"],
    },
  },
  employerId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      required: true,
      enum: ["Employer"],
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
