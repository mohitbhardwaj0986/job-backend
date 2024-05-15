import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        console.log("Please enter valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["job seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate token

userSchema.methods.generatejwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
};

export const User = mongoose.model("User", userSchema);
