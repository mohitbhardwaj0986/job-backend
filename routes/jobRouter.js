import express from "express"
import { deleteJobs, getAllJobs, getMyJobs, jobDetails, postJobs, updateJobs } from "../controllers/jobController.js"
import { isAuthorized } from "../middlewares/auth.js"
const router = express.Router()

router.get("/jobs", getAllJobs)
router.get("/myjobs", isAuthorized,getMyJobs)
router.post("/post",isAuthorized ,postJobs)
router.post("/updatejob/:id",isAuthorized ,updateJobs)
router.delete("/deletejob/:id",isAuthorized ,deleteJobs)
router.get("/jobdetail/:id", isAuthorized, jobDetails)

export default router