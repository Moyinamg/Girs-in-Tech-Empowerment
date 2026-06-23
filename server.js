const express = require("express");
const path    = require("path");
const { OpenAI } = require("openai");

const app  = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── AI chat endpoint ──────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      reply: fallbackReply(message),
      fallback: true,
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are a warm, knowledgeable, and encouraging tech mentor for the "Girls in Tech Hub" — a supportive community for girls and non-binary students exploring technology.

Your personality:
- Friendly, upbeat, and genuine — like a brilliant older sister in tech
- Clear and accurate — you give real, correct information (coding, math, CS concepts, career advice, etc.)
- Encouraging without being fake — you acknowledge struggles honestly and give practical help
- Inclusive and safe — you celebrate diversity in tech

You can answer ANY question accurately and helpfully:
- Technical: HTML, CSS, JavaScript, Python, algorithms, debugging, data structures, AI/ML, cybersecurity, etc.
- Educational: math, science, study tips, learning strategies
- Career: internships, portfolios, interviews, networking, college applications
- Emotional support: impostor syndrome, confidence, stress, belonging in tech

Always be accurate. If a question has a definitive technical answer, give it correctly. Keep responses concise but complete — no unnecessary fluff.`;

    const messages = [{ role: "system", content: systemPrompt }];

    if (Array.isArray(history)) {
      history.slice(-10).forEach((h) => {
        if (h.role && h.content) messages.push({ role: h.role, content: h.content });
      });
    }

    messages.push({ role: "user", content: message });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "I'm not sure about that — could you rephrase?";
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.json({ reply: fallbackReply(message), fallback: true });
  }
});

// ── Keyword fallback (used when no API key) ───────────────────
function fallbackReply(raw) {
  const t = raw.toLowerCase();
  if (/hi|hello|hey/.test(t))
    return "Hiii 👋🏽 I'm glad you're here! Ask me anything — coding, math, career tips, or just how you're feeling today.";
  if (/cod(e|ing)|javascript|python|html|css|java\b/.test(t))
    return "Coding is a superpower you're building. What specific concept or bug can I help you with? 💻";
  if (/math|algebra|calculus|statistics/.test(t))
    return "Math is the language of logic — and you can learn it! What topic is giving you trouble?";
  if (/impostor|imposter|don'?t belong/.test(t))
    return "Impostor syndrome is super common in tech — even among professionals. You're here, you're learning, and that makes you a techie. 🤍";
  if (/nervous|scared|anxious/.test(t))
    return "Feeling nervous shows you care. Break things into small steps, start with just one, and build momentum. You've got this 💙";
  if (/study|learn|homework/.test(t))
    return "Try the Pomodoro method: 25 min focused work, 5 min break. Repeat. It's scientifically proven to help with retention! ⏱️";
  if (/tired|overwhelmed|exhausted/.test(t))
    return "You're doing a lot. Rest is not laziness — it's how your brain consolidates learning. Take a real break. 🫶🏽";
  return "Great question! Add your OpenAI API key to unlock full AI-powered answers — I'll be able to answer anything accurately. 💡";
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Girls in Tech Hub running on http://0.0.0.0:${port}`);
});
