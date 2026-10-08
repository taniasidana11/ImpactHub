# ImpactHub

A centralized web-based platform connecting NGOs, volunteers, and donors to simplify discovery and participation in social impact activities.

---

## Live Demo

| Layer | URL |
|---|---|
| Frontend | [impacthub.vercel.app](#) — *coming soon* |
| Backend API | [impacthub-api.onrender.com](#) — *coming soon* |

---

## Project Overview

The social service sector suffers from fragmented information — NGOs rely on disconnected channels like social media and word of mouth to reach volunteers. ImpactHub solves this by providing a single, structured, and accessible platform where:

- **NGOs** can register, get verified, and manage events
- **Volunteers** can discover, filter, and register for social impact events
- **Admins** can verify NGOs and moderate platform content

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 |
| Backend | Node.js + Express.js |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Token (JWT) |
| Password Hashing | bcrypt |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | MongoDB Atlas |

---

## Features

### Authentication
- JWT-based registration and login
- Role-based access control — Admin, NGO, Volunteer
- Secure password hashing with bcrypt

### NGO
- Create and manage organizational profile
- Post, edit, and delete events
- Track registered volunteers per event
- Admin verification system

### Volunteer
- Browse and filter events by location and date
- Register and cancel event registrations
- Personal dashboard showing registered events

### Admin
- Approve or reject NGO registrations
- Remove fraudulent events or profiles
- View all registered users

---

## Project Structure
```
impacthub/
├── frontend/               # Next.js / React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── utils/
│
├── backend/                # Node.js + Express backend
|   ├── src/
│   |   ├── config/          # Database connection and environment config
│   |   ├── controllers/     # Business logic for each route module
│   |   ├── middleware/      # Authentication and role-based access middleware
│   |   ├── models/          # Mongoose schemas for User, NGO, and Event
│   |   ├── routes/          # Express route definitions
│   |   ├── types/           # Shared TypeScript interfaces and types
│   |   ├── utils/           # Helper functions and utilities
│   |   └── server.ts        # Application entry point
|   ├── dist/                # Compiled JavaScript output
|   ├── tsconfig.json        # TypeScript compiler configuration
|   ├── .env                 # Environment variables
|   └── package.json
│
├── docs/                   # Documentation
│   └── SRS.pdf
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js v20.x or higher
- npm v9.x or higher
- MongoDB Atlas account
- TypeScript 5.x (installed automatically via npm)

---

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/impacthub.git
cd impacthub
```

---

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `/frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## Environment Variables

### Backend — `/backend/.env`

| Variable | Description |
|---|---|
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for signing JWT tokens |
| PORT | Port for the Express server |
| NODE_ENV | Environment mode — development or production |

### Frontend — `/frontend/.env.local`

| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_URL | Base URL of the backend API |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/auth/me | Get current user profile |

### NGO
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/ngos | Get all verified NGOs |
| POST | /api/ngos | Create NGO profile |
| PUT | /api/ngos/:id | Update NGO profile |
| DELETE | /api/ngos/:id | Delete NGO profile |

### Events
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/events | Get all events |
| POST | /api/events | Create a new event |
| PUT | /api/events/:id | Update an event |
| DELETE | /api/events/:id | Delete an event |

### Volunteer
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/events/:id/register | Register for an event |
| DELETE | /api/events/:id/register | Cancel registration |
| GET | /api/volunteers/events | Get my registered events |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/ngos | Get all NGO requests |
| PUT | /api/admin/ngos/:id/verify | Approve or reject NGO |
| GET | /api/admin/users | Get all users |
| DELETE | /api/admin/users/:id | Remove a user |

---

## Documentation

The full Software Requirements Specification (SRS) document is available in the repository:

📎 [docs/SRS.pdf](docs/SRS.pdf)

---

## Future Enhancements

- Donation and payment integration via Razorpay
- Real-time chat between volunteers and NGOs
- AI-based event recommendations
- NGO analytics and participation reports
- React Native mobile application
- Unit and integration testing with Jest and Supertest

---

## Author

**Aniket**<br>
GitHub: https://github.com/MankooAniket<br>
LinkedIn: https://linkedin.com/in/mankooaniket

---
