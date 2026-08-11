import express from "express";
import meetingController from "../controllers/meeting.controller.js";

const router = express.Router();

router.post("/bot", meetingController.createBot);

router.get("/bot/:botId", meetingController.getBot);

router.get("/transcript/:transcriptId", meetingController.getTranscript);

export default router;