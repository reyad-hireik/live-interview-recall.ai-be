import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import interviewRoutes from "./routes/interview.js";
const meetingRoutes = require("./routes/meeting.routes");

const recallRoutes =
    require("./routes/recall.routes");

const recallWebhook =
    require("./webhooks/recall.webhook");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/", (req, res) => {
    res.send("Welcome to the Interview API");
});

app.use("/api/meetings", meetingRoutes);

app.post("/webhooks/recall", recallWebhook);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});