require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// ✅ Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Route: POST /api/v1/ai/suggest-answer
router.post("/suggest-answer", async (req, res) => {
  const { question, description } = req.body;

  if (!question && !description) {
    return res.status(400).json({ error: "Question text is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ✅ Better prompt for comprehensive & structured answer
 const prompt = `
You are an expert AI assistant. Answer the following question clearly and concisely.

---
Question: ${question}
Description: ${description || "N/A"}
---

Reply with these sections:

1️⃣ Definition:
2-4 short, clear sentences.

 2️⃣ Recommended Books: 
1-2 top books (with authors).

3️⃣ Recommended Videos:
1-2 YouTube channels or videos (with emojis 📺).

4️⃣ Recommended Websites:
2-3 reliable sites.

 Format: 
Use the bold headings and emojis exactly as shown above.
Start each numbered section on a new line.
Add a blank line (a gap) between each numbered section.
List items under each heading on their own new lines (no bullet points or stars).
Keep it brief and focused.
`;

    // ✅ Generate AI content
    const result = await model.generateContent(prompt);

    const aiAnswer = result.response.text();

    res.status(200).json({
      status: "success",
      suggestion: aiAnswer,
    });
  } catch (error) {
    console.error("❌ AI generation error:", error.message);
    res.status(500).json({
      error: "Failed to generate AI suggestion.",
      details: error.message,
    });
  }
});

module.exports = router;
