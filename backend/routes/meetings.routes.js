import { Router } from "express";
import { createMeeting, validateMeeting, getMeeting, deleteMeeting } from "../controllers/meeting.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", authenticateToken, createMeeting);
router.get("/validate", validateMeeting); // Public or authenticated? Roadmap implies public access for checking
router.get("/:meetingCode", authenticateToken, getMeeting);
router.delete("/:meetingCode", authenticateToken, deleteMeeting);

export default router;
