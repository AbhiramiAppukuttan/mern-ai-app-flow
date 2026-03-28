const express = require("express");
const axios = require("axios");
const cors = require("cors");
const connectDB = require("./db/connectDb");
const Data = require("./model/dataModel");
require("dotenv").config();

const app = express();


connectDB();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server running...");
});


app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openchat/openchat-3.5-0106:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://mern-ai-app-flow.vercel.app",
          "X-Title": "MERN AI App",
        },
      }
    );

    res.json({
      result: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});



app.post("/api/save", async (req, res) => {
  try {
    const { prompt, response } = req.body;

    const newData = new Data({ prompt, response });
    await newData.save();

    res.json({ message: "Saved to DB" });

  } catch (error) {
    console.error("SAVE ERROR:", error.message);
    res.status(500).json({ error: "Save failed" });
  }
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
