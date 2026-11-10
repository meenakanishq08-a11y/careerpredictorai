# careerpredictorai
AI Career Path Recommender 🚀 (Enterprise Edition)  A production-grade full-stack MERN web application with interactive 3D graphics (Three.js / React Three Fiber), real-time career solar system simulation, and a multi-provider AI Career Intelligence Engine (Google Gemini, OpenAI GPT-4o-mini, and a Dynamic Contextual Inference Engine).
🌟 Key Enterprise Features
🪐 Interactive 3D Career Galaxy: Explores personalized career paths as an orbiting solar system. Planet size, glow, and orbital velocity scale dynamically with compatibility fit scores. Includes orbit drag controls, hover cards, and optional scroll zoom toggle.
🗺️ 3D Winding Roadmap Journey: Chronological phased milestones visualized in 3D space with glowing checkpoint nodes. Toggle milestones to track completion progress in real time.
🧪 Real-Time "What-If" Skill Simulator: Instant, zero-latency deterministic re-scoring engine. Add or remove high-leverage skills (e.g., TypeScript, Docker, AWS, PyTorch) with 1-click quick-add pills to immediately watch career trajectories and orbital planets recalculate.
⚖️ Side-by-Side Career Evaluation: Interactive comparison modal comparing compensation ranges, 5-year growth outlooks, market demand, required competencies, and identified skill gaps.
🧠 Tri-Tier AI Intelligence Engine:
OpenAI GPT-4o-mini: Robust JSON-mode completion with 3-attempt exponential backoff.
Google Gemini 1.5 Flash: Seamless multi-provider support via GEMINI_API_KEY.
Dynamic Contextual Inference Engine (Zero-Cost / Offline): Analyzes user's real skills, education, and domain interests across 14 industry categories to generate tailor-made recommendations with realistic salary bands and phased roadmaps without requiring an API key.
⚡ 1-Click Demo Personas: Pre-configured templates on the Profile page (Web Engineer, AI Specialist, UI/UX Designer, Product Lead) allowing instantaneous end-to-end testing.
🌙 Production UI & Dual Themes: Polished dark & light mode system with CSS variables, Framer Motion page transitions, and toast notifications.
🔒 Enterprise Security: Bcrypt password hashing (12 rounds), JWT token auth with ownership verification on every read/write/delete, rate-limiting on auth and generation routes, and in-memory or Atlas MongoDB persistence.
🛠️ Tech Stack
Layer	Technologies
Frontend	React 18, Vite, React Router v6, Axios
3D Graphics	Three.js, @react-three/fiber, @react-three/drei
Animation	Framer Motion
State	React Context (AuthContext, ToastContext, ThemeContext)
Styling	Modern CSS Variables, Glassmorphism, Space Grotesk & Inter typography
Backend	Node.js, Express, Mongoose (MongoDB)
Authentication	JSON Web Tokens (jsonwebtoken), bcryptjs
AI Models	Google Gemini (gemini-1.5-flash), OpenAI (gpt-4o-mini), Dynamic Rule-Based Inference
Testing	Jest, Supertest (24 Automated Unit & Integration Tests)
