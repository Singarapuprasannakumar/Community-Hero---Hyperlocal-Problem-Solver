# Community Hero AI 🏙️🤖

**The Operating System for Smart Communities**

Community Hero AI is a full-stack, production-ready platform that turns citizen reports into measurable urban outcomes. It leverages modern web technologies, AI triage capabilities, and robust data storage to manage, route, and predict ETAs and costs for civic issues in real-time.

---

## 🚀 Key Features

* **Full-Stack Architecture:** Built with [TanStack Start](https://tanstack.com/start) and React 19 for seamless server-side rendering (SSR) and blistering fast client-side navigation.
* **Real Database Persistence:** Powered by MongoDB and Mongoose. All issues, users, and civic data are persistently stored, not just mocked in local storage.
* **Secure Google OAuth:** Robust authentication using Google Identity Services (GIS) and the `google-auth-library`. Features real cryptographic backend token verification and secure JWT sessions.
* **Modern UI/UX:** Styled with Tailwind CSS, Framer Motion animations, and Radix UI primitives. Includes dark mode support and fully responsive layouts.
* **Interactive Maps:** Leaflet integration for geolocation and plotting citizen reports on a dynamic city map.
* **AI Integration Readiness:** Designed to accommodate AI models for automated issue triaging (potholes, infrastructure damage, etc.).

---

## 🛠️ Technology Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons
* **Framework:** TanStack Start (Vite / Nitro)
* **State Management:** Zustand, TanStack Query
* **Backend:** Server-side API Routes (via TanStack Start `server` handlers)
* **Database:** MongoDB (via Mongoose)
* **Authentication:** Google OAuth 2.0 (`@react-oauth/google`), JSON Web Tokens (JWT)

---

## 💻 Getting Started (Local Development)

### Prerequisites
* Node.js (v20+ recommended)
* A running instance of MongoDB (either locally or via MongoDB Atlas)
* A Google Cloud Console project with OAuth 2.0 Credentials

### 1. Clone the repository
```bash
git clone https://github.com/your-username/community-hero-ai.git
cd community-hero-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on the provided `.env.example`:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# JWT Authentication
JWT_SECRET=your_super_secure_random_64_character_secret

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/communityhero
# (or your MongoDB Atlas connection string)

# Application Settings
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
```

> **Note:** Make sure to add `http://localhost:8080` (or your Vite dev server port) to your **Authorized JavaScript Origins** in your Google Cloud Console.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

---

## 🌍 Deployment

This project is built on Nitro (via TanStack Start) and is optimized for zero-config deployment to platforms like Vercel, Netlify, or Cloudflare Pages.

### Deploying to Vercel

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the required Environment Variables (`VITE_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`, `MONGODB_URI`).
4. Ensure your `MONGODB_URI` points to a cloud database (like MongoDB Atlas), as localhost will not work on serverless environments.
5. Add your new Vercel production URL to your Google Cloud Console's Authorized Origins.
6. Deploy!

---

## 📂 Project Structure

```
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite and TanStack configuration
└── src/
    ├── components/       # Reusable UI components (buttons, nav, cards)
    ├── lib/              # Utility functions (cn, etc.)
    ├── routes/           # File-based routing (pages and API endpoints)
    │   ├── __root.tsx    # Root layout and context providers
    │   ├── api.*.ts      # Server-side API handlers (auth, issues)
    │   └── login.tsx     # Google OAuth Login page
    ├── shared/
    │   ├── models/       # Mongoose Schemas (user.model.ts, issue.model.ts)
    │   ├── services/     # Business logic (auth-service, server-db)
    │   ├── stores/       # Zustand state stores (auth, accessibility)
    │   └── types/        # TypeScript interfaces
    └── styles.css        # Global Tailwind styles
```

---

## 🤝 Contributing

Contributions are always welcome! Feel free to open a PR or submit an Issue.

---

## 📜 License

This project is licensed under the MIT License.
