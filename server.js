import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* Home Test */
app.get("/", (req, res) => {
  res.send("Server running");
});

/* Chat Route */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "system",
              content: "You are a calm, supportive, empathetic assistant."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();
    console.log("HF RAW:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "AI did not return a response.";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Server error" });
  }
});

/* Start Server */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
