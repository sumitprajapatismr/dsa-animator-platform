# AlgoFlow AI | Enterprise-Grade DSA Animator & Collaborative Playground

AlgoFlow AI is a production-quality, full-stack MERN application representing a comprehensive learning and coding platform for Data Structures and Algorithms. The platform features responsive visualizers, Monaco Editor playgrounds, AI-powered tutors, Streaks/XP gamification, and real-time collaborative workspaces with whiteboard syncing.

---

## Technical Stack

### Frontend
- **React 19 & Vite**: High-performance single page application.
- **Tailwind CSS v3**: Clean, modern dark-themed aesthetics with glowing states and glassmorphic cards.
- **Redux Toolkit**: Centralized global user state and XP synchronizer.
- **Monaco Editor**: Full-featured code editor with syntax highlighting, autocomplete, and auto-saves.
- **Recharts**: Responsive statistics graphs tracking XP velocities and progress values.
- **Socket.IO Client**: Real-time message, canvas drawing, and editor input synchronization.

### Backend
- **Node.js & Express.js**: Modular backend router with secure JWT authorization and RBAC.
- **MongoDB & Mongoose**: Normalized database collections for users, progress indices, problems, rooms, and submissions.
- **Socket.IO**: WebSocket connection orchestrator managing room states.
- **Google Gemini SDK**: AI tutor prompt generation (with fallback simulation checks).
- **CodeRunner**: Sandbox sub-process process compiler (runs JS, Python, C++, C, Java) with evaluation mock simulations.

---

## Folder Architecture

```
dsa-animator-platform/
├── backend/
│   ├── config/          # Database, WebSockets
│   ├── controllers/     # Auth, Progress, Problems, AI, Rooms, Admin
│   ├── middleware/      # Auth, Validaion, Error Handling, Rate Limiters
│   ├── models/          # MongoDB Schemas
│   ├── routes/          # REST Endpoint Registrations
│   ├── utils/           # AI helper, Sandbox code execution (codeRunner.js)
│   ├── server.js        # Main entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/         # Redux Store Config
│   │   ├── components/  # Reusable UI elements
│   │   ├── context/     # Socket connection provider
│   │   ├── features/    # Auth Slice
│   │   ├── pages/       # Dashboard, Visualizer, Playground, Collaboration, Learn, Admin
│   │   ├── utils/       # Step generators (visualizerEngine.ts)
│   │   ├── App.tsx      # React router configuration
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
└── package.json         # Concurrent start orchestrator
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (e.g. `mongodb://localhost:27017`)

### Installation & Run

1. **Clone the repository and enter the directory**:
   ```bash
   cd dsa-animator-platform
   ```

2. **Install all packages concurrently** (runs in both backend and frontend):
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   Create a `.env` file under the `/backend` folder. Defaults are preloaded:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dsa-animator
   JWT_SECRET=super_secret_dsa_jwt_key_12345
   JWT_REFRESH_SECRET=super_secret_dsa_refresh_key_67890
   GEMINI_API_KEY=your_gemini_key_here
   ```

4. **Launch development servers concurrently**:
   - Start backend:
     ```bash
     npm run dev:backend
     ```
   - Start frontend:
     ```bash
     npm run dev:frontend
     ```
   - Open browser at `http://localhost:5173`.

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Create new user.
- `POST /login`: Authenticate credentials, refresh streak, issue cookies.
- `POST /logout`: Terminate session.
- `GET /me`: Fetch authenticated user profile.
- `GET /verify/:token`: Complete email verification (+100 XP reward).

### 📈 Learning Progress (`/api/progress`)
- `GET /dashboard`: Aggregate completion metrics, weekly XP graphs, streak count, and heatmap calendar matrix.
- `POST /algo`: Increment viewed algorithm markers (+20 XP).

### 💻 Problem Playground (`/api/problems`)
- `GET /`: Search problem catalog.
- `GET /:slug`: Fetch problem description and starter language templates.
- `POST /run`: Execute playground editor inputs safely.
- `POST /:id/submit`: Evaluate solution against all test cases.

### 🤖 AI Tutor (`/api/ai`)
- `POST /ask`: Query tutor with custom DSA questions.
- `POST /review`: Request full code logic review.
- `POST /hint`: Ask for progressive hints.
- `GET /quiz/:topic`: Generate an AI multiple choice quiz.

### 👥 Collaboration Rooms (`/api/rooms`)
- `POST /`: Initialize a new live coding workspace.
- `GET /:code`: Join room lobby using access code.
