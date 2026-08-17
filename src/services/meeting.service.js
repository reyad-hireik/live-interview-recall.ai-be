import axios from "axios";
import dotenv from "dotenv";
import { companyLogoBase64 } from "../helper/asset.js";

dotenv.config();

const recallClient = axios.create({
    baseURL: process.env.RECALL_BASE_URL,
    headers: {
        Authorization: process.env.RECALL_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const createBot = async ({
    meetingUrl,
    botName = "Meeting Notetaker",
    joinAt = null,
    candidateId
}) => {
    const payload = {
        meeting_url: meetingUrl,
        bot_name: botName,
        metadata: {
            candidate_id: candidateId
        },
        automatic_video_output: {
            in_call_not_recording: {
                kind: "jpeg",
                b64_data: companyLogoBase64,
            },
            in_call_recording: {
                kind: "jpeg",
                b64_data: companyLogoBase64,
            },
        },
        recording_config: {
            transcript: {
                provider: {
                    recallai_streaming: {
                        mode: "prioritize_accuracy",
                        language_code: "auto",
                    },
                },
                diarization: {
                    use_separate_streams_when_available: true,
                },
            },
        },
    };

    // Only add join_at for scheduled meetings
    if (joinAt) {
        payload.join_at = joinAt;
    }

    const response = await recallClient.post(
        "/api/v1/bot/",
        payload
    );

    return response.data;
};

const getBot = async (botId) => {
    const response = await recallClient.get(`/api/v1/bot/${botId}`);
    const bot = response?.data?.bot || response?.data || {};
    const statusChanges = Array.isArray(bot.status_changes) ? bot.status_changes : [];
    const latestStatus = statusChanges[statusChanges.length - 1]?.code || null;

    const activeStatuses = [
        "joining_call",
        "in_waiting_room",
        "in_call_not_recording",
        "in_call_recording",
    ];
    const endedStatuses = ["call_ended", "recording_done", "done"];

    return {
        bot: {
            id: bot.id || botId,
            name: (bot.bot_name || "Meeting Notetaker").toLowerCase(),
        },
        metadata: bot.metadata || {},
        status: activeStatuses.includes(latestStatus) ? "in_call" : "call_ended",
    };
};

const getTranscript = async (transcriptId) => {
    const response = await recallClient.get(
        `/api/v1/transcript/${transcriptId}/`
    );
    const transcriptUrl = response?.data.data.download_url || {};
    const transcript = await axios.get(transcriptUrl);

    return transcript.data.map(entry => {
        const speech = entry.words.map(word => word.text).join(" ");
        const lastWord = entry.words[entry.words.length - 1];

        return {
            participant: entry.participant.name,
            isHost: entry.participant.is_host,
            platform: entry.participant.platform,
            speech: speech,
            language: entry.language_code,
            speechAt: lastWord?.end_timestamp?.absolute || ""
        };
    });
};

const getRecording = async (recordingId) => {
    const response = await recallClient.get(
        `/api/v1/recording/${recordingId}/`
    );
    const recordingUrl = response?.data?.media_shortcuts?.video_mixed?.data?.download_url || {};

    return recordingUrl;
};

export default {
    createBot,
    getBot,
    getTranscript,
    getRecording
};