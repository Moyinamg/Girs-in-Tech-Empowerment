const express = require("express");
const path    = require("path");

const app  = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Chat endpoint ─────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }
  res.json({ reply: smartReply(message) });
});

// ═══════════════════════════════════════════════════════════════
//  SMART REPLY ENGINE — comprehensive keyword + topic matching
// ═══════════════════════════════════════════════════════════════
function smartReply(raw) {
  const t = raw.toLowerCase().trim();
  const has = (...words) => words.some((w) => t.includes(w));

  // ── Greetings ──────────────────────────────────────────────
  if (has("hi ", "hello", "hey ", "what's up", "sup ", "good morning", "good afternoon", "good evening") || t === "hi" || t === "hey" || t === "hello")
    return "Hey! 👋🏽 I'm your Girls in Tech Hub AI mentor. Ask me anything — coding, math, algorithms, career tips, confidence, or just how your day's going. I'm here for all of it!";

  if (has("how are you", "how r you", "how're you"))
    return "I'm doing great and ready to help you level up! 💙 What can I help you with today?";

  if (has("your name", "who are you", "what are you"))
    return "I'm the Girls in Tech Hub AI mentor — built to give you real, accurate answers about coding, tech, math, careers, and everything in between. Ask me anything! 🤖";

  // ── HTML ───────────────────────────────────────────────────
  if (has("html")) {
    if (has("what is", "what's", "explain", "define", "mean"))
      return "HTML (HyperText Markup Language) is the standard language for creating web pages. It uses elements called tags (like <h1>, <p>, <div>) to structure content. A basic page looks like:\n\n<!DOCTYPE html>\n<html>\n  <head><title>My Page</title></head>\n  <body><h1>Hello World!</h1></body>\n</html>\n\nHTML is always your first step in web development! 🌐";
    if (has("tag", "element"))
      return "Common HTML tags:\n• <h1>–<h6> → Headings (h1 is biggest)\n• <p> → Paragraph\n• <a href='url'> → Link\n• <img src='url' alt='desc'> → Image\n• <div> → Container block\n• <span> → Inline container\n• <ul>/<ol>/<li> → Lists\n• <form>, <input>, <button> → Forms\n\nEvery tag has an opening <tag> and usually a closing </tag>. Self-closing tags like <img /> don't need a closing tag.";
    if (has("form", "input"))
      return "HTML forms collect user input:\n\n<form action='/submit' method='POST'>\n  <input type='text' name='username' placeholder='Your name'>\n  <input type='email' name='email'>\n  <input type='password' name='pass'>\n  <button type='submit'>Submit</button>\n</form>\n\nThe method is usually GET (data in URL) or POST (data in body — more secure for sensitive info).";
    return "HTML is the skeleton of every webpage. It structures your content using tags. Want help with a specific HTML concept — forms, tables, semantic elements, or something else? 🌐";
  }

  // ── CSS ────────────────────────────────────────────────────
  if (has("css")) {
    if (has("what is", "what's", "explain", "define"))
      return "CSS (Cascading Style Sheets) makes your HTML look beautiful! It controls colors, fonts, layout, spacing, animations, and more.\n\nExample:\np {\n  color: #333;\n  font-size: 16px;\n  margin: 0 auto;\n}\n\nCSS uses selectors to target HTML elements and declarations (property: value) to style them.";
    if (has("flexbox", "flex"))
      return "Flexbox is a CSS layout system for arranging items in a row or column:\n\n.container {\n  display: flex;\n  justify-content: center;  /* horizontal alignment */\n  align-items: center;      /* vertical alignment */\n  gap: 1rem;\n}\n\nKey properties:\n• flex-direction: row | column\n• justify-content: flex-start | center | space-between | space-around\n• align-items: flex-start | center | flex-end\n• flex-wrap: wrap (allows items to wrap to next line)";
    if (has("grid"))
      return "CSS Grid is a 2D layout system (rows AND columns):\n\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */\n  gap: 1.5rem;\n}\n\nGrid is perfect for card layouts, dashboards, and page-level structure. Use Flexbox for 1D layouts (one row or column), Grid for 2D layouts (both).";
    if (has("animation", "transition", "animate"))
      return "CSS animations:\n\n/* Transition (on hover) */\n.btn {\n  transition: background 0.3s ease, transform 0.2s ease;\n}\n.btn:hover {\n  background: blue;\n  transform: translateY(-2px);\n}\n\n/* Keyframe animation */\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to   { opacity: 1; }\n}\n.element {\n  animation: fadeIn 0.5s ease;\n}";
    return "CSS styles your HTML! It controls colors, spacing, fonts, and layout. What CSS concept do you want to explore — selectors, Flexbox, Grid, animations, or responsive design?";
  }

  // ── JavaScript ─────────────────────────────────────────────
  if (has("javascript", " js ") || t.startsWith("js ") || t.endsWith(" js")) {
    if (has("what is", "explain", "define"))
      return "JavaScript (JS) is the programming language of the web — it makes pages interactive! While HTML structures content and CSS styles it, JS adds behavior:\n\n// Change text on button click\ndocument.getElementById('btn').addEventListener('click', () => {\n  document.getElementById('msg').textContent = 'Hello! 👋';\n});\n\nJS runs directly in browsers AND on servers (Node.js). It's one of the most in-demand skills in tech!";
    if (has("function", "arrow"))
      return "JavaScript functions:\n\n// Regular function\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Arrow function (modern shorthand)\nconst greet = (name) => `Hello, ${name}!`;\n\n// Calling it\nconsole.log(greet('Moyin')); // Hello, Moyin!\n\nArrow functions are shorter and don't have their own 'this' context — useful in callbacks!";
    if (has("array", "loop", "for loop", "forEach", "map", "filter"))
      return "JavaScript arrays & loops:\n\nconst girls = ['Ada', 'Grace', 'Reshma'];\n\n// for loop\nfor (let i = 0; i < girls.length; i++) {\n  console.log(girls[i]);\n}\n\n// forEach (cleaner)\ngirls.forEach(name => console.log(name));\n\n// map → creates new array\nconst shout = girls.map(name => name.toUpperCase());\n\n// filter → returns elements that pass a test\nconst longNames = girls.filter(name => name.length > 3);";
    if (has("promise", "async", "await", "fetch"))
      return "Async JavaScript — fetching data from an API:\n\n// Modern async/await\nasync function getData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\ngetData();\n\nawait pauses execution until the Promise resolves. Always wrap in try/catch to handle errors!";
    if (has("dom", "document", "query"))
      return "DOM manipulation — controlling your webpage with JS:\n\n// Select elements\nconst el = document.getElementById('myId');\nconst els = document.querySelectorAll('.myClass');\n\n// Change content\nel.textContent = 'New text';\nel.innerHTML = '<strong>Bold!</strong>';\n\n// Change style\nel.style.color = 'blue';\nel.classList.add('active');\nel.classList.remove('hidden');\n\n// Listen for events\nel.addEventListener('click', () => alert('Clicked!'));";
    return "JavaScript brings webpages to life with interactivity! What JS topic do you need help with — functions, arrays, DOM manipulation, events, async/await, or something else? 💛";
  }

  // ── Python ─────────────────────────────────────────────────
  if (has("python")) {
    if (has("what is", "explain", "define"))
      return "Python is a beginner-friendly, powerful language used for web development, data science, AI/ML, automation, and more. Its syntax reads almost like English:\n\n# Print to console\nprint('Hello, World!')\n\n# Variable\nname = 'Moyin'\nprint(f'Hey {name}!')\n\n# List\ngirls = ['Ada', 'Grace', 'Reshma']\n\nPython is often the #1 recommended first language for beginners! 🐍";
    if (has("loop", "for", "while"))
      return "Python loops:\n\n# for loop\nfruits = ['apple', 'mango', 'berry']\nfor fruit in fruits:\n    print(fruit)\n\n# range loop\nfor i in range(5):  # 0, 1, 2, 3, 4\n    print(i)\n\n# while loop\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\n\nPython uses indentation (4 spaces) instead of curly braces to define blocks!";
    if (has("function", "def"))
      return "Python functions:\n\ndef greet(name, greeting='Hello'):\n    return f'{greeting}, {name}!'\n\nprint(greet('Ada'))           # Hello, Ada!\nprint(greet('Grace', 'Hey')) # Hey, Grace!\n\n# Lambda (anonymous function)\nsquare = lambda x: x ** 2\nprint(square(5))  # 25\n\nDefault parameters (like greeting='Hello') are super useful for flexible functions!";
    if (has("class", "object", "oop"))
      return "Python OOP:\n\nclass Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n\n    def introduce(self):\n        return f'Hi, I'm {self.name}, grade {self.grade}'\n\n# Create instance\nada = Student('Ada', 'A+')\nprint(ada.introduce())  # Hi, I'm Ada, grade A+\n\nClasses are blueprints; objects are instances of that blueprint.";
    return "Python is amazing — used for web, AI, data science, automation, and more! What Python concept do you need help with? 🐍";
  }

  // ── Data Structures ────────────────────────────────────────
  if (has("data structure", "linked list", "stack", "queue", "hash map", "hash table", "dictionary", "tree", "binary tree", "graph")) {
    if (has("linked list"))
      return "A Linked List is a sequence of nodes where each node holds data and a pointer to the next node.\n\nNode: [data | next →] → [data | next →] → [data | null]\n\n• Singly linked list: each node points to the next\n• Doubly linked list: each node points to both next and previous\n\nPros: O(1) insertion/deletion at head\nCons: O(n) access by index (no random access like arrays)\n\nUsed in: undo/redo, browser history, music playlists.";
    if (has("stack"))
      return "A Stack is LIFO — Last In, First Out. Think of a stack of plates!\n\nOperations:\n• push(item) — add to top → O(1)\n• pop() — remove from top → O(1)\n• peek() — view top without removing → O(1)\n\nIn Python:\nstack = []\nstack.append('a')  # push\nstack.append('b')\nstack.pop()        # returns 'b'\n\nUsed in: undo functions, call stacks, expression evaluation.";
    if (has("queue"))
      return "A Queue is FIFO — First In, First Out. Think of a line at the cafeteria!\n\nOperations:\n• enqueue(item) — add to back → O(1)\n• dequeue() — remove from front → O(1)\n\nIn Python:\nfrom collections import deque\nq = deque()\nq.append('first')\nq.append('second')\nq.popleft()  # returns 'first'\n\nUsed in: task scheduling, print queues, BFS graph traversal.";
    if (has("hash", "dictionary"))
      return "A Hash Map (Dictionary in Python) stores key-value pairs for O(1) average lookup:\n\n# Python dictionary\nstudent = {\n  'name': 'Ada',\n  'grade': 'A+',\n  'school': 'MIT'\n}\n\nprint(student['name'])  # Ada\nstudent['score'] = 98   # add/update\ndel student['grade']    # delete\n\n'name' in student       # True — O(1) lookup!\n\nUnder the hood, a hash function converts keys into array indices.";
    if (has("binary tree", "bst", "binary search tree"))
      return "A Binary Search Tree (BST) stores data so that:\n• Left subtree < root\n• Right subtree > root\n\n      8\n     / \\\n    3   10\n   / \\    \\\n  1   6   14\n\nOperations (balanced tree):\n• Search: O(log n)\n• Insert: O(log n)\n• Delete: O(log n)\n\nPerfect for fast searching and sorted data. An unbalanced BST degrades to O(n) — that's why AVL trees and Red-Black trees self-balance!";
    return "Data structures organize data so programs can use it efficiently. Key ones to know: Arrays, Linked Lists, Stacks, Queues, Hash Maps, Trees, and Graphs. Which one do you want to dive into?";
  }

  // ── Algorithms ─────────────────────────────────────────────
  if (has("algorithm", "sorting", "sort", "binary search", "big o", "time complexity", "space complexity", "recursion", "dynamic programming")) {
    if (has("big o", "time complexity", "space complexity"))
      return "Big O Notation measures algorithm efficiency (how it scales with input size n):\n\nO(1) — Constant: same time regardless of n (e.g., array lookup)\nO(log n) — Logarithmic: binary search\nO(n) — Linear: single loop through array\nO(n log n) — Merge sort, quicksort (average)\nO(n²) — Quadratic: nested loops (bubble sort)\nO(2ⁿ) — Exponential: naive recursion (avoid!)\n\nAlways aim for the smallest Big O you can achieve!";
    if (has("binary search"))
      return "Binary Search finds an element in a SORTED array in O(log n) time:\n\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nEach step cuts the search space in HALF — that's why it's O(log n)!";
    if (has("recursion", "recursive"))
      return "Recursion is when a function calls itself to solve smaller subproblems:\n\n# Factorial: 5! = 5 × 4 × 3 × 2 × 1\ndef factorial(n):\n    if n <= 1:      # base case — MUST exist!\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))  # 120\n\nEvery recursive solution needs:\n1. A base case (stops the recursion)\n2. A recursive case (smaller subproblem)\n\nWithout a base case → infinite recursion → stack overflow!";
    if (has("dynamic programming", "dp", "memoization"))
      return "Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems and caching results (memoization).\n\n# Fibonacci — naive: O(2ⁿ), DP: O(n)\ndef fib(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n\nDP patterns to learn: 0/1 Knapsack, Longest Common Subsequence, Coin Change, Longest Increasing Subsequence.";
    if (has("sort", "bubble", "merge", "quick"))
      return "Sorting algorithms:\n\n• Bubble Sort — O(n²) — simple but slow, good for learning\n• Selection Sort — O(n²) — finds min repeatedly\n• Insertion Sort — O(n²) — efficient for small/nearly sorted data\n• Merge Sort — O(n log n) — stable, divide and conquer ✅\n• Quick Sort — O(n log n) avg — fast in practice ✅\n• Heap Sort — O(n log n) — in-place\n• Tim Sort — Python's built-in (hybrid merge + insertion)\n\nFor interviews, understand Merge Sort and Quick Sort deeply!";
    return "Algorithms are step-by-step instructions for solving problems. Key topics: Big O notation, sorting, searching, recursion, and dynamic programming. Which would you like to explore?";
  }

  // ── Git / Version Control ──────────────────────────────────
  if (has("git", "github", "version control", "commit", "branch", "pull request", "merge conflict")) {
    if (has("what is git", "explain git", "what's git"))
      return "Git is a version control system — it tracks changes to your code over time so you can go back to any previous version and collaborate with others.\n\nEssential commands:\ngit init              # start a repo\ngit add .             # stage all changes\ngit commit -m 'msg'   # save a snapshot\ngit push              # upload to GitHub\ngit pull              # download latest changes\ngit status            # see what's changed\ngit log               # view history";
    if (has("branch"))
      return "Git branches let you work on features without touching the main code:\n\ngit branch feature-login    # create branch\ngit checkout feature-login  # switch to it\n# (or combined:)\ngit checkout -b feature-login\n\ngit merge feature-login     # merge back to main\ngit branch -d feature-login # delete branch\n\nBest practice: never code directly on main — always use a feature branch!";
    if (has("merge conflict"))
      return "A merge conflict happens when two branches change the same line differently. Git marks the conflict:\n\n<<<<<<< HEAD\nyour version here\n=======\nother branch's version here\n>>>>>>> feature-branch\n\nTo resolve: manually edit the file to keep what you want, delete the markers, then:\ngit add .\ngit commit -m 'resolve merge conflict'\n\nConflicts are normal — every developer faces them!";
    return "Git is essential for every developer! It tracks your code history and enables collaboration. Key commands: init, add, commit, push, pull, branch, merge. What do you need help with?";
  }

  // ── Web Development / React ────────────────────────────────
  if (has("react", "component", "useState", "useEffect", "jsx", "props")) {
    if (has("what is react", "explain react"))
      return "React is a JavaScript library (by Meta/Facebook) for building user interfaces using reusable components.\n\n// A simple React component\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}! 👋</h1>;\n}\n\n// Use it like:\n<Welcome name='Ada' />\n\nReact uses a Virtual DOM to update only what changed — making UIs fast and efficient.";
    if (has("usestate", "state"))
      return "useState — manage data that changes in a component:\n\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nuseState(initialValue) returns [currentValue, setterFunction]. Calling the setter re-renders the component!";
    if (has("useeffect", "effect", "lifecycle"))
      return "useEffect runs side effects (API calls, subscriptions, DOM changes) after render:\n\nuseEffect(() => {\n  // Runs after every render\n}, []);  // Empty array = runs ONCE on mount\n\nuseEffect(() => {\n  fetchData();\n}, [userId]);  // Runs when userId changes\n\nuseEffect(() => {\n  const timer = setInterval(tick, 1000);\n  return () => clearInterval(timer); // Cleanup!\n}, []);";
    return "React is one of the most in-demand frontend skills! It's component-based, declarative, and powers millions of apps. What React concept do you want to learn? ⚛️";
  }

  // ── Math topics ────────────────────────────────────────────
  if (has("algebra", "equation", "solve for x", "linear equation")) {
    return "Algebra basics — solving linear equations:\n\nGoal: isolate the variable (get x alone)\n\nExample: 3x + 7 = 22\nStep 1: subtract 7 from both sides → 3x = 15\nStep 2: divide both sides by 3 → x = 5\n✓ Check: 3(5) + 7 = 22 ✅\n\nKey rules:\n• Whatever you do to one side, do to the other\n• Inverse operations undo each other (+ ↔ −, × ↔ ÷)\n• Distribute first: 2(x + 3) = 2x + 6\n\nWhat equation are you working on?";
  }

  if (has("calculus", "derivative", "integral", "limit")) {
    if (has("derivative"))
      return "Derivatives measure the rate of change (slope) of a function at any point.\n\nCommon rules:\n• d/dx [xⁿ] = nxⁿ⁻¹ (power rule)\n• d/dx [sin x] = cos x\n• d/dx [eˣ] = eˣ\n• d/dx [ln x] = 1/x\n• Chain rule: d/dx [f(g(x))] = f'(g(x)) · g'(x)\n\nExample: f(x) = 3x² + 5x\nf'(x) = 6x + 5  (slope at any point x)";
    if (has("integral"))
      return "Integrals find the area under a curve (reverse of differentiation).\n\nCommon rules:\n• ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (power rule)\n• ∫ eˣ dx = eˣ + C\n• ∫ sin x dx = −cos x + C\n\nDefinite integral (area between a and b):\n∫[a→b] f(x) dx = F(b) − F(a)\nwhere F is the antiderivative of f.\n\nThe +C is the constant of integration (always include it for indefinite integrals!)";
    return "Calculus is the math of change and accumulation. The two main branches are differentiation (rates of change) and integration (areas/accumulation). What topic are you working on?";
  }

  if (has("statistic", "probability", "mean", "median", "mode", "standard deviation", "normal distribution")) {
    if (has("mean", "average"))
      return "Mean, Median, and Mode — measures of center:\n\n• Mean (average): sum ÷ count\n  Data: 4, 7, 7, 9, 13 → Mean = 40/5 = 8\n\n• Median (middle value when sorted):\n  Data: 4, 7, 7, 9, 13 → Median = 7\n  (For even count, average the two middle values)\n\n• Mode (most frequent):\n  Data: 4, 7, 7, 9, 13 → Mode = 7\n\nWhen to use which:\n- Mean: no extreme outliers\n- Median: outliers present (e.g., income data)\n- Mode: categorical data";
    if (has("probability"))
      return "Probability = (favorable outcomes) / (total outcomes)\n\nP(A) ranges from 0 (impossible) to 1 (certain)\n\nBasic rules:\n• P(not A) = 1 − P(A)\n• P(A or B) = P(A) + P(B) − P(A and B)\n• P(A and B) = P(A) × P(B) [if independent]\n\nExample: Probability of rolling a 3 on a die?\nP(3) = 1/6 ≈ 0.167 = 16.7%\n\nConditional probability: P(A|B) = P(A and B) / P(B)";
    return "Statistics and probability are the foundation of data science and AI! Mean, median, mode, standard deviation, probability distributions — what specific concept do you need help with?";
  }

  // ── Career Advice ──────────────────────────────────────────
  if (has("portfolio", "github portfolio", "build a portfolio")) {
    return "Building a student portfolio in tech:\n\n1. GitHub Profile — your coding resume:\n   • Pin 4–6 best projects\n   • Write clear READMEs (what it does, tech used, how to run)\n   • Green commit squares show consistency\n\n2. Personal website (free options):\n   • GitHub Pages (free hosting for static sites)\n   • Vercel, Netlify — deploy in minutes\n\n3. Project ideas that impress:\n   • To-do app (shows CRUD basics)\n   • Weather app (shows API usage)\n   • Something that solves a real problem you have!\n\nStart with 2–3 solid projects rather than 10 incomplete ones. Quality > quantity! 💼";
  }

  if (has("internship", "job", "career", "get hired", "tech job", "software engineer", "swe")) {
    return "Breaking into tech — a real roadmap:\n\n1. Learn fundamentals: pick one language (Python or JS), data structures, algorithms\n2. Build 2–3 portfolio projects — deploy them publicly\n3. Contribute to open source — even fixing docs counts!\n4. Network: LinkedIn, Twitter/X tech community, local meetups, hackathons\n5. Apply early for internship programs:\n   • Google STEP Intern (freshmen/sophomores)\n   • Microsoft Explore\n   • Amazon Jr. SDE\n   • Replit, Slack, and many startups have intern programs too\n6. Prep for coding interviews: LeetCode Easy/Medium, Cracking the Coding Interview\n\nYou belong in these spaces — go for it! 🚀";
  }

  if (has("interview", "leetcode", "coding interview", "technical interview")) {
    return "Tech interview prep:\n\n📚 Resources:\n• LeetCode — start with Easy, then Medium\n• NeetCode.io — structured roadmap (free!)\n• Cracking the Coding Interview (book)\n• AlgoExpert, Grokking the Coding Interview\n\n🔑 Key topics:\n• Arrays & Strings\n• Hash Maps\n• Two Pointers\n• Sliding Window\n• Trees & Graphs (BFS/DFS)\n• Dynamic Programming (start with memoization)\n\n💡 During the interview:\n1. Clarify the problem before coding\n2. Think out loud — they want to see your process\n3. Start with a brute force, then optimize\n4. Test with examples and edge cases\n\nConsistency beats intensity — 30 min/day beats 5 hours on weekends!";
  }

  if (has("ai", "machine learning", "ml", "deep learning", "neural network", "data science")) {
    if (has("what is", "explain", "define"))
      return "AI (Artificial Intelligence) is when computers learn to perform tasks that normally require human intelligence.\n\nSubfields:\n• Machine Learning — computers learn patterns from data without being explicitly programmed\n• Deep Learning — uses neural networks with many layers (how ChatGPT works!)\n• Natural Language Processing (NLP) — AI understanding/generating text\n• Computer Vision — AI understanding images/video\n\nTo get started:\n1. Learn Python\n2. Study numpy, pandas for data manipulation\n3. Learn scikit-learn for classical ML\n4. Then explore TensorFlow or PyTorch for deep learning";
    if (has("neural network"))
      return "A Neural Network is inspired by the human brain — it's a series of layers of 'neurons' (mathematical functions):\n\nInput Layer → Hidden Layers → Output Layer\n\nEach connection has a weight. Training adjusts these weights using:\n1. Forward pass — compute predictions\n2. Loss function — measure how wrong we are\n3. Backpropagation — calculate gradients\n4. Gradient descent — update weights to reduce loss\n\nDeep Neural Networks (many hidden layers) power image recognition, language models, and more. The breakthrough that made them work? Lots of data + GPU computing power! 🧠";
    return "AI and Machine Learning are the hottest areas in tech right now! The path: Python → Math foundations (linear algebra, stats) → scikit-learn → deep learning frameworks. What specific aspect interests you?";
  }

  // ── Cybersecurity ──────────────────────────────────────────
  if (has("cybersecurity", "hacking", "security", "encryption", "password", "sql injection", "xss")) {
    if (has("encryption"))
      return "Encryption scrambles data so only authorized parties can read it:\n\n• Symmetric encryption — same key to encrypt and decrypt (AES)\n• Asymmetric encryption — public key encrypts, private key decrypts (RSA, used in HTTPS)\n• Hashing — one-way conversion (SHA-256, bcrypt for passwords)\n\nWhen you log into a website, your password should be hashed, not stored in plain text. A good hash function makes it practically impossible to reverse!\n\nHTTPS = HTTP + TLS (Transport Layer Security) — encrypts data in transit.";
    if (has("sql injection"))
      return "SQL Injection is when attackers insert malicious SQL code into input fields:\n\nVulnerable query:\nSELECT * FROM users WHERE username = '" + userInput + "';\n\nAttack input: ' OR '1'='1\nResult: logs in without a real password!\n\nPrevention:\n1. Use parameterized queries / prepared statements\n2. Never concatenate user input into SQL strings\n3. Use an ORM (Sequelize, Prisma, SQLAlchemy)\n4. Validate and sanitize all inputs\n\nSQL injection is in the OWASP Top 10 — most common web vulnerabilities!";
    return "Cybersecurity is one of the fastest-growing fields in tech with huge demand! Areas include penetration testing, cryptography, network security, and application security. What specific topic interests you?";
  }

  // ── Study / Learning strategies ────────────────────────────
  if (has("study", "learn", "focus", "concentrate", "memorize", "retention")) {
    if (has("pomodoro", "timer", "technique"))
      return "The Pomodoro Technique — scientifically proven for focus:\n\n⏱️ How it works:\n1. Choose ONE task\n2. Set a timer for 25 minutes\n3. Work with zero distractions (phone face-down, notifications off)\n4. Take a 5-minute break\n5. After 4 rounds, take a 20-30 minute break\n\n🧠 Why it works:\n• Forces single-tasking (multitasking kills productivity by 40%)\n• Creates urgency without pressure\n• Regular breaks prevent mental fatigue\n\nFree tools: Pomofocus.io, Forest app, or just your phone timer!";
    return "Learning strategies that actually work:\n\n1. Active recall — test yourself instead of re-reading\n2. Spaced repetition — review material at increasing intervals (Anki app)\n3. Pomodoro — 25 min focused work, 5 min break\n4. Teach it — explain concepts in your own words\n5. Build something — applying knowledge beats passive watching\n\n🧠 The biggest myth: highlighting notes = learning. It doesn't! Active testing does. What subject are you studying?";
  }

  // ── Impostor Syndrome / Confidence ────────────────────────
  if (has("impostor", "imposter", "don't belong", "dont belong", "not good enough", "not smart enough", "fake", "fraud")) {
    return "Let's talk about impostor syndrome — because it's real and it's lying to you. 💙\n\nFact: 70% of people experience impostor syndrome, including senior engineers at Google, NASA scientists, and CEOs.\n\nWhat it actually means when you feel like a fraud:\n→ You care about doing well\n→ You're growing into something new (discomfort is part of learning)\n→ You have high standards for yourself\n\nWhat to do:\n1. Write down 3 things you've learned or done this week\n2. Separate feelings from facts — 'I feel lost' ≠ 'I am incapable'\n3. Talk to someone in tech — you'll find they feel it too\n\nYou belong exactly where you are. The room needs you in it. 🤍";
  }

  if (has("nervous", "scared", "afraid", "anxious", "anxiety") && has("tech", "coding", "code", "class", "school", "stem")) {
    return "Being nervous about tech is completely normal — it means you're stepping outside your comfort zone, which is exactly where growth happens. 💙\n\nSome real talk:\n• Every developer googles things constantly (seriously, even seniors)\n• Nobody understands everything — we're all learning\n• The learning curve is steep at first, then it gets easier\n\nPractical steps for right now:\n1. Break the overwhelming thing into the tiniest possible first step\n2. Do just that one thing\n3. Celebrate finishing it\n4. Repeat\n\nProgress compounds. The version of you who started is already different from the version of you reading this. Keep going. 🚀";
  }

  if (has("confident", "confidence", "believe in myself", "self doubt")) {
    return "Confidence in tech is built through action, not waiting until you feel ready — because that feeling never fully comes.\n\nWhat actually builds confidence:\n✅ Finishing something — even a tiny project\n✅ Debugging and solving a problem yourself\n✅ Asking a question that you were afraid to ask\n✅ Helping someone else with something you just learned\n\nTrack your wins: keep a 'done' list, not just a to-do list. Read it when you feel like a fraud.\n\nYou're not behind. You're right on time. 💙";
  }

  if (has("motivation", "motivated", "give up", "quit", "tired of coding", "hate coding")) {
    return "Motivation comes and goes — discipline is what keeps you moving. 💙\n\nOn the days you want to quit:\n1. Shrink the task: 'I'll just open the file' → often you'll keep going\n2. Remember your why: what made you interested in tech in the first place?\n3. Change the environment: different location, different playlist\n4. Give yourself permission to have a bad day — it doesn't erase your progress\n\nEvery developer has days where they feel like they've forgotten everything. That's normal. The ones who make it are the ones who show up the next day anyway.\n\nYou've got this. 🚀";
  }

  // ── Burnout / Mental health ────────────────────────────────
  if (has("burnout", "exhausted", "overwhelmed", "too much", "stressed", "stressed out", "breakdown")) {
    return "You're carrying a lot, and it's okay to acknowledge that. 🫶🏽\n\nBurnout signs: constant exhaustion, nothing feels interesting, every task feels impossible, you feel detached from things you used to enjoy.\n\nWhat helps:\n1. Rest without guilt — your brain consolidates learning during rest\n2. Set a real boundary: one evening per week with zero school/tech\n3. Move your body — even a 10-minute walk resets your nervous system\n4. Talk to someone you trust\n5. If it's persistent, please talk to a counselor or therapist\n\nYou are more than your productivity. Your worth is not measured in commits or grades. Take care of yourself first — everything else follows. 💙";
  }

  // ── General helpful catchalls ──────────────────────────────
  if (has("what should i learn", "where to start", "how to start coding", "beginner", "just started"))
    return "Perfect starting point for coding beginners:\n\n🗺️ Roadmap:\n1. HTML & CSS — build your first webpage (2–4 weeks)\n2. JavaScript basics — make it interactive (4–6 weeks)\n3. Build 2–3 projects — a personal page, a quiz app, a weather app\n4. Learn Git & GitHub — version control is essential\n5. Choose a path:\n   • Frontend: React, Tailwind CSS\n   • Backend: Node.js + Express, Python + Flask/Django\n   • Data/AI: Python, NumPy, Pandas\n\n📚 Free resources:\n• freeCodeCamp.org\n• The Odin Project\n• CS50 (Harvard, free on edX)\n• MDN Web Docs (best reference for HTML/CSS/JS)\n\nStart building. Learning by doing beats tutorial-watching every time! 🚀";

  if (has("free resource", "free course", "youtube", "learn free", "free website"))
    return "Best free coding resources:\n\n🌐 Websites:\n• freeCodeCamp.org — full curriculum, free certificates\n• The Odin Project — hands-on, project-based\n• cs50.harvard.edu — world-class CS intro\n• MDN Web Docs — best HTML/CSS/JS reference\n• Khan Academy — math and CS basics\n\n▶️ YouTube channels:\n• Traversy Media (web dev)\n• The Coding Train (creative coding)\n• Fireship (quick, modern)\n• TechWithTim (Python)\n• Kevin Powell (CSS master)\n\n💻 Practice:\n• LeetCode / HackerRank — coding challenges\n• Codepen.io — experiment with HTML/CSS/JS\n• Replit — build and share projects instantly";

  if (has("thank", "thanks", "thank you", "appreciate"))
    return "You're so welcome! 💙 That's what I'm here for. Keep building, keep asking questions, and know that every question you ask is a sign of strength, not weakness. What else can I help you with?";

  if (has("bye", "goodbye", "see you", "later", "take care"))
    return "See you later! 👋🏽 Remember — you're building something every day, even on the hard days. Come back anytime you have a question. You've got this! 💙";

  // ── Default fallback ────────────────────────────────────────
  return "Great question! I can help with:\n\n💻 Coding: HTML, CSS, JavaScript, Python, React, Git\n📐 Math: Algebra, Calculus, Statistics, Probability\n🧠 CS Concepts: Data Structures, Algorithms, Big O\n🔐 Tech Fields: AI/ML, Cybersecurity, Web Dev\n💼 Career: Portfolios, Internships, Interview Prep\n💙 Mindset: Confidence, Impostor Syndrome, Motivation\n\nTry asking something like 'What is a linked list?' or 'How do I prepare for a coding interview?' and I'll give you a thorough answer!";
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Girls in Tech Hub running on http://0.0.0.0:${port}`);
});
