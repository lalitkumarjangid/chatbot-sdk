# Veterinary Chatbot SDK

A website-integrable chatbot SDK that answers veterinary-related questions and books veterinary appointments. Built with Next.js, Express, MongoDB, and Google Gemini AI.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend Demo** | [https://chatbot-sdk-frontend.vercel.app](https://chatbot-sdk-frontend.vercel.app) |
| **Backend API** | [https://chatsdkbot.vercel.app](https://chatsdkbot.vercel.app) |
| **GitHub Repository** | [https://github.com/lalitkumarjangid/chatbot-sdk](https://github.com/lalitkumarjangid/chatbot-sdk) |

### Quick Test

Add this to any HTML page to test the chatbot:

```html
<script>
  window.VetChatbotConfig = {
    apiUrl: "https://chatsdkbot.vercel.app"
  };
</script>
<script src="https://chatsdkbot.vercel.app/chatbot.js"></script>
```

![Chatbot Demo](./docs/demo.png)

## 🎯 Features

- **🤖 AI-Powered Q&A**: Answers generic veterinary questions using Google Gemini AI
- **📅 Appointment Booking**: Conversational flow to collect and book appointments
- **🔌 Easy Integration**: Single script tag to embed on any website
- **💾 Persistent Sessions**: Conversations stored in MongoDB
- **🎨 Modern UI**: Beautiful, responsive chat widget with shadcn/ui

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Websites                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Website A     │  │   Website B     │  │   Website C     │  │
│  │  <script src=   │  │  <script src=   │  │  <script src=   │  │
│  │  "chatbot.js"/> │  │  "chatbot.js"/> │  │  "chatbot.js"/> │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │ HTTP/REST
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend API (Express)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Routes    │──│  Controllers │──│   Services   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                                    │                   │
│         ▼                                    ▼                   │
│  ┌──────────────┐                   ┌──────────────┐            │
│  │  Middleware  │                   │  Gemini AI   │            │
│  │  (Validation │                   │   Service    │            │
│  │   & Errors)  │                   └──────────────┘            │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB                                  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │   Sessions   │  │ Appointments │                             │
│  │  (messages,  │  │  (bookings)  │                             │
│  │   context)   │  │              │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
chatbot-sdk/
├── backend/                 # Express API Server + SDK
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic (Gemini, Sessions)
│   │   ├── widget/         # Embeddable SDK source
│   │   │   ├── ChatWidget.tsx  # Main widget component
│   │   │   ├── api.ts          # API client
│   │   │   ├── types.ts        # TypeScript types
│   │   │   ├── styles.css      # Widget styles
│   │   │   └── index.tsx       # Entry point
│   │   └── index.ts        # App entry point
│   ├── public/             # Built SDK output (chatbot.js)
│   ├── vite.widget.config.ts  # Vite library build config
│   └── package.json
│
├── frontend/               # Next.js Demo & Admin Site
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── admin/         # Admin dashboard
│   │   │   └── playground/    # API playground
│   │   ├── components/    # UI components
│   │   │   ├── chatbot/   # Chat widget components
│   │   │   └── ui/        # shadcn components
│   │   ├── lib/           # API client, utilities
│   │   └── store/         # Zustand state management
│   └── package.json
│
├── .env.example           # Environment template
├── package.json           # Root workspace config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone and install dependencies**

```bash
git clone <repo-url>
cd chatbot-sdk
npm install
```

2. **Set up environment variables**

```bash
# Copy example env files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env and add your values:
# - MONGODB_URI
# - GEMINI_API_KEY
```

3. **Start MongoDB** (if running locally)

```bash
mongod
```

4. **Run the development servers**

```bash
# Run both backend and frontend
npm run dev

# Or run individually:
npm run dev:backend   # http://localhost:5001
npm run dev:frontend  # http://localhost:3000
```

5. **Build the SDK** (outputs to `backend/public/chatbot.js`)

```bash
cd backend
npm run build:widget
```

## � Deployment to Vercel

Both the backend and frontend can be deployed to Vercel as separate projects.

### Quick Start

1. Push your repository to GitHub
2. Deploy backend to Vercel:
   - Root directory: `./backend`
   - Environment variables: `MONGODB_URI`, `GEMINI_API_KEY`
3. Deploy frontend to Vercel:
   - Root directory: `./frontend`
   - Environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`

**For detailed instructions**, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## �📦 SDK Integration

### Basic Integration

Add this single script tag to embed the chatbot (SDK is served from the backend):

```html
<script src="https://your-backend-domain.com/chatbot.js"></script>
```

### With User Context (Optional)

Pass contextual data to personalize the experience:

```html
<script>
  window.VetChatbotConfig = {
    apiUrl: "https://your-backend-domain.com", // Required: your backend URL
    userId: "user_123",      // Optional: user identifier
    userName: "John Doe",    // Optional: personalization
    petName: "Buddy",        // Optional: pet context
    source: "marketing-website" // Optional: tracking source
  };
</script>
<script src="https://your-backend-domain.com/chatbot.js"></script>
```

## 🔌 API Reference

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send message & get AI response |
| GET | `/api/chat/history/:sessionId` | Get conversation history |
| POST | `/api/chat/reset-appointment/:sessionId` | Reset appointment flow |

### Session Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions/:sessionId` | Get session details |
| GET | `/api/sessions/user/:userId` | Get user's sessions |
| DELETE | `/api/sessions/:sessionId` | Delete session |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List all appointments |
| GET | `/api/appointments/upcoming` | Get upcoming appointments |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/:id` | Get appointment by ID |
| PATCH | `/api/appointments/:id` | Update appointment |
| POST | `/api/appointments/:id/cancel` | Cancel appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |

### Example: Send Message

```bash
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What vaccines does my puppy need?",
    "context": {
      "userName": "John",
      "petName": "Buddy"
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "abc123-def456",
    "message": "Great question! Puppies typically need several core vaccines...",
    "intent": "general",
    "isAppointmentFlow": false
  }
}
```

## 🧠 Key Design Decisions

### 1. Conversational Appointment Booking

The appointment booking uses a **backend state machine** rather than a frontend form:

- **Why**: Maintains consistency across sessions, allows resume if user leaves mid-flow
- **Flow**: Detects intent → asks for missing fields one at a time → confirms → saves

### 2. Session-Based Architecture

- Sessions are created automatically on first message
- Session ID stored in localStorage for persistence
- Allows anonymous users while supporting optional context

### 3. SDK Bundle Strategy

- SDK source lives in `backend/src/widget/` for simplified deployment
- Uses **Vite library mode** with IIFE output
- Built SDK served as static file from backend (`/chatbot.js`)
- CSS injected by JS (no separate stylesheet)
- All dependencies bundled (no external React required)

### 4. Veterinary-Only Responses

The Gemini system prompt enforces veterinary-only responses:
- Pet care, vaccinations, diet, illnesses, preventive care
- Politely declines non-veterinary questions
- Always recommends consulting a licensed vet for serious concerns

## ⚠️ Assumptions & Trade-offs

### Assumptions

1. **Single clinic**: No multi-tenancy support (can be added)
2. **Basic validation**: Phone format is checked but not verified
3. **Date parsing**: Natural language dates rely on Gemini interpretation
4. **No authentication**: SDK works without user login

### Trade-offs

| Decision | Trade-off |
|----------|-----------|
| IIFE bundle format | Larger bundle, but works everywhere |
| In-memory appointment states | Lost on server restart (use Redis in production) |
| No WebSocket | Simpler setup, but no real-time updates |
| Single Gemini model | Could add fallback models for reliability |

## 🔮 Future Improvements

- [ ] **Admin Dashboard**: View/manage appointments with calendar UI
- [ ] **Multi-language Support**: i18n for chat responses
- [ ] **WebSocket Support**: Real-time typing indicators
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **Analytics Dashboard**: Track usage metrics
- [ ] **Email/SMS Notifications**: Appointment confirmations
- [ ] **Multiple AI Models**: Fallback providers (OpenAI, Claude)
- [ ] **Theme Customization**: More styling options in SDK config
- [ ] **Voice Input**: Speech-to-text for accessibility
- [ ] **Unit & E2E Tests**: Jest + Playwright test suites

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| UI Components | shadcn/ui, Tailwind CSS |
| State Management | Zustand |
| HTTP Client | Axios |
| Backend | Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| AI | Google Gemini API |
| SDK Bundler | Vite |
| Validation | Zod |

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

Built with ❤️ for pet lovers everywhere 🐾
# chatbot-sdk
