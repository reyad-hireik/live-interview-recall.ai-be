const recallWebhook = async (req, res) => {
    try {
        const event = req.body;

        console.log(
            "[Recall Webhook]",
            JSON.stringify(event, null, 2)
        );

        return res.sendStatus(200);
    } catch (error) {
        console.error(
            "[Recall Webhook] Error:",
            error
        );

        return res.sendStatus(500);
    }
};

module.exports = recallWebhook;