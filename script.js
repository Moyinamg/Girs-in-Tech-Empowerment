// ── RESOURCE CARD FILTER ─────────────────────────────────────
document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;
    document.querySelectorAll(".resource-card").forEach((card) => {
      const tags = card.dataset.tags || "";
      if (filter === "all" || tags.includes(filter)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// ── NAVBAR: scroll state + active link tracking ──────────────
const header   = document.getElementById("site-header");
const navLinks = document.querySelectorAll("#nav-links a:not(.nav-cta)");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);

  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
}, { passive: true });

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObs.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// ── ANIMATED COUNTERS ─────────────────────────────────────────
const counterObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const dur    = 1500;
    const start  = performance.now();
    const tick   = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  }),
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => counterObs.observe(el));

// ── CHAT ──────────────────────────────────────────────────────
const chatWindow = document.getElementById("chat-window");
const chatInput  = document.getElementById("chat-input");
const sendBtn    = document.getElementById("send-btn");

// Conversation history sent to the AI for context
const conversationHistory = [];

if (chatWindow && chatInput && sendBtn) {
  setTimeout(() => {
    botSay("Hey future tech queen 👑💻 I'm your AI-powered tech mentor. Ask me anything — coding questions, math help, career advice, or just how you're feeling about tech today. I'm here for all of it!");
  }, 500);

  sendBtn.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleSend(); }
  });
}

document.querySelectorAll("[data-quick-message]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.getAttribute("data-quick-message");
    if (text) sendMessage(text);
  });
});

function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  sendMessage(text);
}

async function sendMessage(text) {
  userSay(text);
  conversationHistory.push({ role: "user", content: text });

  const indicator = showTyping();
  const reply = await fetchReply(text);
  indicator.remove();

  botSay(reply);
  conversationHistory.push({ role: "assistant", content: reply });
}

async function fetchReply(message) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: conversationHistory.slice(-12),
      }),
    });

    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    return data.reply || "I didn't get a response — try again!";
  } catch {
    return "Hmm, I couldn't connect right now. Check your connection and try again! 🔌";
  }
}

// ── UI HELPERS ────────────────────────────────────────────────
function userSay(text) {
  const bubble = makeBubble("user", text);
  chatWindow.appendChild(bubble);
  scrollChat();
}

function botSay(text) {
  const bubble = makeBubble("bot", text);
  chatWindow.appendChild(bubble);
  scrollChat();
}

function makeBubble(role, text) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${role}`;
  const bub = document.createElement("div");
  bub.className = "chat-bubble";
  bub.textContent = text;
  msg.appendChild(bub);
  return msg;
}

function showTyping() {
  const msg = document.createElement("div");
  msg.className = "chat-message bot typing-indicator";
  msg.innerHTML = `<div class="chat-bubble"><span class="t-dot"></span><span class="t-dot"></span><span class="t-dot"></span></div>`;
  chatWindow.appendChild(msg);
  scrollChat();
  return msg;
}

function scrollChat() {
  chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
}
