import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import meetingRoutes from "./routes/meeting.routes.js";
import meetingWebhook from "./webhooks/meeting.webhook.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));


app.use("/api/meetings", meetingRoutes);

app.post("/webhooks/meeting", meetingWebhook);

app.use("/", (req, res) => {
    res.send("Welcome to the Interview API");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});