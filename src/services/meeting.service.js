import axios from "axios";

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
}) => {
    const payload = {
        meeting_url: meetingUrl,
        bot_name: botName,

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
    const response = await recallClient.get(
        `/api/v1/bot/${botId}/`
    );

    return response.data;
};

const getTranscript = async (transcriptId) => {
    const response = await recallClient.get(
        `/api/v1/transcript/${transcriptId}/`
    );

    return response.data;
};

export default {
    createBot,
    getBot,
    getTranscript,
};