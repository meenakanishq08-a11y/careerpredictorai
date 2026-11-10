# AI Career Path Recommender 🚀 (Enterprise Edition)

A production-grade full-stack MERN web application with interactive 3D graphics (Three.js / React Three Fiber), real-time career solar system simulation, and a multi-provider AI Career Intelligence Engine (Google Gemini, OpenAI GPT-4o-mini, and a Dynamic Contextual Inference Engine).

---

## 🌟 Key Enterprise Features

- **🪐 Interactive 3D Career Galaxy**: Explores personalized career paths as an orbiting solar system. Planet size, glow, and orbital velocity scale dynamically with compatibility fit scores. Includes orbit drag controls, hover cards, and optional scroll zoom toggle.
- **🗺️ 3D Winding Roadmap Journey**: Chronological phased milestones visualized in 3D space with glowing checkpoint nodes. Toggle milestones to track completion progress in real time.
- **🧪 Real-Time "What-If" Skill Simulator**: Instant, zero-latency deterministic re-scoring engine. Add or remove high-leverage skills (e.g., TypeScript, Docker, AWS, PyTorch) with 1-click quick-add pills to immediately watch career trajectories and orbital planets recalculate.
- **⚖️ Side-by-Side Career Evaluation**: Interactive comparison modal comparing compensation ranges, 5-year growth outlooks, market demand, required competencies, and identified skill gaps.
- **🧠 Tri-Tier AI Intelligence Engine**:
  1. **OpenAI GPT-4o-mini**: Robust JSON-mode completion with 3-attempt exponential backoff.
  2. **Google Gemini 1.5 Flash**: Seamless multi-provider support via `GEMINI_API_KEY`.
  3. **Dynamic Contextual Inference Engine (Zero-Cost / Offline)**: Analyzes user's real skills, education, and domain interests across 14 industry categories to generate tailor-made recommendations with realistic salary bands and phased roadmaps without requiring an API key.
- **⚡ 1-Click Demo Personas**: Pre-configured templates on the Profile page (Web Engineer, AI Specialist, UI/UX Designer, Product Lead) allowing instantaneous end-to-end testing.
- **🌙 Production UI & Dual Themes**: Polished dark & light mode system with CSS variables, Framer Motion page transitions, and toast notifications.
- **🔒 Enterprise Security**: Bcrypt password hashing (12 rounds), JWT token auth with ownership verification on every read/write/delete, rate-limiting on auth and generation routes, and in-memory or Atlas MongoDB persistence.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **3D Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Animation** | Framer Motion |
| **State** | React Context (`AuthContext`, `ToastContext`, `ThemeContext`) |
| **Styling** | Modern CSS Variables, Glassmorphism, Space Grotesk & Inter typography |
| **Backend** | Node.js, Express, Mongoose (MongoDB) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **AI Models** | Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), Dynamic Rule-Based Inference |
| **Testing** | Jest, Supertest (24 Automated Unit & Integration Tests) |

---

## 🚀 Quick Start (VS Code / Local)

### 1. Open in VS Code
Open the root directory in VS Code:
```
D:\carrerproject1\career-path-recommender
```
*(Or the parent folder `D:\carrerproject1` — both work seamlessly!)*

### 2. Run Both Server & Client with 1 Command
In your VS Code terminal (press `Ctrl + ~`):
```bash
npm run dev
```
*(Or double-click `start-dev.bat` in File Explorer)*

### 3. Open in Browser
Visit: **[http://localhost:5173](http://localhost:5173)**

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=supersecretjwtkey_changeme_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Database (Leave as default to use automatic in-memory MongoDB, or paste your MongoDB Atlas URI)
MONGO_URI=mongodb://localhost:27017/career_recommender

# AI Keys (Optional — if omitted, the Dynamic Contextual Intelligence Engine activates automatically)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=...
```

### Frontend (`client/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Automated Test Suite

Run the full Jest test suite across Auth, Profile, and Recommendation endpoints:
```bash
cd server
npm test
```
Result: **24 passed, 3 test suites passed (100% pass rate)**.

---

## 📡 API Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | Public | Health check & timestamp |
| `/api/auth/register` | POST | Public | Register new user account |
| `/api/auth/login` | POST | Public | Authenticate user & return JWT |
| `/api/auth/me` | GET | Protected | Retrieve authenticated user profile |
| `/api/profile` | GET | Protected | Fetch current candidate profile |
| `/api/profile` | PUT | Protected | Upsert candidate skills, education, & goals |
| `/api/recommendations` | POST | Protected | Generate 4 custom AI career trajectories |
| `/api/recommendations` | GET | Protected | Paginated recommendation history |
| `/api/recommendations/:id` | GET | Protected | Get single recommendation (ownership checked) |
| `/api/recommendations/:id` | DELETE | Protected | Delete recommendation |
| `/api/recommendations/:id/roadmap` | PATCH | Protected | Toggle roadmap milestone completion |
| `/api/recommendations/simulate` | POST | Protected | Run deterministic What-If simulation |
