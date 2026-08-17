import meetingService from "../services/meeting.service.js";

const createBot = async (req, res) => {
    try {
        const {
            meetingUrl,
            botName,
            joinAt,
            candidateId
        } = req.body;

        if (!meetingUrl) {
            return res.status(400).json({
                success: false,
                message: "meetingUrl is required",
            });
        }

        const bot = await meetingService.createBot({
            meetingUrl,
            botName,
            joinAt,
            candidateId
        });

        return res.status(201).json({
            success: true,
            bot,
        });

    } catch (error) {
        console.error(
            "[Recall] Create bot failed:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            message: "Failed to create Recall bot",
            error: error.response?.data || error.message,
        });
    }
};


const getBot = async (req, res) => {
    try {
        const { botId } = req.params;

        const bot = await meetingService.getBot(botId);

        return res.json({
            success: true,
            data: bot,
        });

    } catch (error) {
        console.error(
            "[Recall] Get bot failed:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            message: "Failed to get Recall bot",
            error: error.response?.data || error.message,
        });
    }
};


const getTranscript = async (req, res) => {
    try {
        const { transcriptId } = req.params;

        const transcript =
            await meetingService.getTranscript(transcriptId);

        return res.json({
            success: true,
            transcript,
        });

    } catch (error) {
        console.error(
            "[Recall] Get transcript failed:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            message: "Failed to get transcript",
            error: error.response?.data || error.message,
        });
    }
};

const getRecording = async (req, res) => {
    try {
        const { recordingId } = req.params;

        const recording = await meetingService.getRecording(recordingId);

        return res.json({
            success: true,
            recording,
        });
    } catch (error) {
        console.error(
            "[Recall] Get recording failed:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            message: "Failed to get recording",
            error: error.response?.data || error.message,
        });
    }
};

export default {
    createBot,
    getBot,
    getTranscript,
    getRecording
};