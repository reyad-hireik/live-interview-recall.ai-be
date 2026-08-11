const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meeting.controller");

router.post("/bot", meetingController.createBot);

router.get("/bot/:botId", meetingController.getBot);

router.get("/transcript/:transcriptId", meetingController.getTranscript);

module.exports = router;