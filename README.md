# ToneShift 🎯

An AI-powered message tone rewriter that instantly transforms your text into Formal, Friendly, Assertive, Apologetic, or Persuasive tones — built with the MERN stack and integrated with Groq's LLM API.


## 🔗 Live Demo

- Frontend: [https://tone-shift-ai-zeta.vercel.app/]
- Backend API: [https://toneshift-ai-server.onrender.com/]

## ✨ Features

- **Single Tone Rewrite** — paste a message, pick a tone, get an instant rewrite
- **Compare All Tones** — generate all 5 tone versions at once, side by side
- **Session History** — view your rewrites from the current session at a glance
- **Persistent Storage** — every rewrite is saved to MongoDB for record-keeping

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- Groq API (LLM integration)

## ⚙️ How It Works

1. User types a message and selects a tone
2. React frontend sends the message + tone to the Express backend
3. Backend builds a prompt and calls the Groq LLM API
4. The AI's rewritten response is saved to MongoDB and returned to the frontend
5. Result is displayed instantly, with the option to compare all 5 tones at once

## 🚀 Getting Started (Run Locally)

**1. Clone the repo**
```bash
git clone https://github.com/YOUR-USERNAME/toneshift.git
cd toneshift
```

**2. Set up the backend**
```bash
cd server
npm install
```
Run the server:
```bash
node index.js
```

**3. Set up the frontend**
```bash
cd ../client
npm install
npm run dev
```

## 📌 Future Improvements

- User authentication for private history
- Tone intensity slider
- "Explain the Shift" feature — AI explains what changed and why

## 👩‍💻 Author

Benedicta — https://www.linkedin.com/in/benedicta-abraham/
