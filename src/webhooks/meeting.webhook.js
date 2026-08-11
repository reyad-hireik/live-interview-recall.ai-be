const meetingWebhook = async (req, res) => {
    try {
        console.log("========== RECALL WEBHOOK ==========");

        console.log(
            "Event:",
            req.body.event
        );

        console.log(
            "Data:",
            JSON.stringify(req.body.data, null, 2)
        );

        console.log("====================================");

        return res.sendStatus(200);
    } catch (error) {
        console.error(
            "[Recall Webhook Error]",
            error
        );

        return res.sendStatus(500);
    }
};

export default meetingWebhook;