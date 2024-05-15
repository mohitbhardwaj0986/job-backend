import express from "express";
import { isAuthorized } from "../middlewares/auth.js";
import {
  applocantGetAllApplication,
  employerGetAllApplication,
  jobseekerDeleteApplication,
  postApplication,
} from "../controllers/applicationController.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.get("/applicantgetall", isAuthorized,applocantGetAllApplication );
router.get("/employergetall", isAuthorized, employerGetAllApplication);
router.delete("/delete/:id", isAuthorized, jobseekerDeleteApplication);
router.post(
  "/post/",
  isAuthorized,
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  postApplication
);

export default router;
