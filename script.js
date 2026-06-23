// -------- NAVBAR: scrolled state + active links --------
const header = document.getElementById("site-header");
const navLinks = document.querySelectorAll("#nav-links a");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  // Add scrolled class for glassmorphism enhancement
  header.classList.toggle("scrolled", window.scrollY > 40);

  // Highlight active nav link based on scroll position
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}, { passive: true });

// -------- SCROLL REVEAL --------
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// -------- ANIMATED COUNTERS --------
const counterEls = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out
        const value = Math.round(progress * progress * (3 - 2 * progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counterEls.forEach((el) => counterObserver.observe(el));

// -------- CHAT --------
const chatWindow = document.getElementById("chat-window");
const chatInput  = document.getElementById("chat-input");
const sendBtn    = document.getElementById("send-btn");
const quickBtns  = document.querySelectorAll("[data-quick-message]");

if (chatWindow && chatInput && sendBtn) {
  // Initial bot greeting with a slight delay
  setTimeout(() => {
    addBotMessage("Hey future tech queen 👑💻 Tell me how you feel about coding, school, or being a girl in tech. I'm here for all of it.");
  }, 400);

  sendBtn.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleSend(); }
  });
}

quickBtns.forEach((btn) => {
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

function sendMessage(text) {
  addUserMessage(text);
  const indicator = addTypingIndicator();
  const delay = 600 + Math.random() * 500;
  setTimeout(() => {
    indicator.remove();
    addBotMessage(generateReply(text));
  }, delay);
}

function addUserMessage(text) {
  const msg = createBubble("user", text);
  chatWindow.appendChild(msg);
  scrollChat();
}

function addBotMessage(text) {
  const msg = createBubble("bot", text);
  chatWindow.appendChild(msg);
  scrollChat();
}

function createBubble(role, text) {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", role);
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");
  bubble.textContent = text;
  msg.appendChild(bubble);
  return msg;
}

function addTypingIndicator() {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", "bot", "typing-indicator");
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");
  bubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
  msg.appendChild(bubble);
  chatWindow.appendChild(msg);
  scrollChat();
  return msg;
}

function scrollChat() {
  chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
}

// -------- REPLY ENGINE --------
function generateReply(rawInput) {
  const t = rawInput.toLowerCase();

  if (/hi|hello|hey/.test(t))
    return "Hiii 👋🏽 I'm glad you're here. How are you feeling about tech today — excited, nervous, or somewhere in between?";

  if (/cod(e|ing)|programming|javascript|python|html|css/.test(t))
    return "Coding is basically learning to think in a new language — confusing at first, but you get better every single time you debug. Seriously, every error you fix is a win. Keep going 💪🏾";

  if (/math/.test(t))
    return "Math is tough for a lot of people, and that doesn't cancel your future in tech. Progress > perfection. Ask questions, practice in small chunks, and you'll get there. 📐";

  if (/impostor|imposter|don'?t belong|don't fit/.test(t))
    return "Impostor syndrome is loud, but it is lying to you. You belong in every tech space you walk into — even while you're still learning. Especially then. 🤍";

  if (/nervous|scared|anxious|afraid/.test(t))
    return "Feeling nervous means you actually care — and that's a real strength. Take a breath, break the task into tiny pieces, and start with just one. You've got this. 💙";

  if (/confident|confidence|believe in me/.test(t))
    return "Confidence is built through action, not waiting until you feel ready. Celebrate every small win — finishing one lab, asking one question, squashing one bug. That's growth. 🌱";

  if (/study|learn|homework|focus/.test(t))
    return "Try the 25–5 Pomodoro rule: 25 min focused on one thing, 5 min break. Repeat 2–3 times. Short focused sessions will beat hours of distracted cramming every time. ⏱️";

  if (/tired|overwhelmed|exhausted|burnout/.test(t))
    return "You are doing SO much. Please rest, drink water, step away from the screen. Rest is not a distraction from success — it's part of it. 🫶🏽";

  if (/friend|lonely|alone/.test(t))
    return "You're not alone — there are thousands of girls in tech going through the exact same thing. This space is proof you belong to a community. 💜";

  if (/proud|did it|finished|completed/.test(t))
    return "YESSS! That's a huge deal and you should feel proud. Every project finished, every concept understood — it all adds up to your future in tech. Celebrate it! 🎉";

  return "Thank you for sharing that 💙 Your feelings are valid, and you 100% belong in tech. Tell me more, or ask me about coding, confidence, math, or impostor syndrome.";
}
