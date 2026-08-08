# ABA Token Economy System

A full-stack behavioral therapy platform designed to help therapists, teachers, and caregivers reinforce positive behaviors for clients with Autism Spectrum Disorder (ASD). Built from direct clinical experience as a Behavior Technician.

**Live Demo:** [token-economy-system.vercel.app](https://token-economy-system.vercel.app)

---

## Overview

Token economy systems are a core Applied Behavior Analysis (ABA) technique where clients earn tokens for displaying target behaviors and exchange them for preferred rewards. This platform digitizes that workflow — giving therapists a fast, visual, and clinically accurate tool that replaces paper-based tracking and generic apps that weren't built for ABA.

---

## Features

- **Client profile management** — create and manage individual profiles for each client
- **Customizable token selection** — choose from built-in emoji tokens or pick any custom emoji
- **Explicit session control** — start and stop sessions with a single action; session data persists even when navigating away
- **Token bank** — tokens accumulate in a persistent bank that survives board resets
- **Reward store** — create client-specific rewards with token costs; redeem with atomic balance deduction
- **Analytics dashboard** — visualize per-client session history, token trends, goal completion rates, and reward redemption data using Recharts

---

## Tech Stack

**Frontend**
- React.js
- Recharts
- React Router

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT)

**Deployment**
- Frontend → Vercel
- Backend + Database → Railway

---

## Database Schema

```sql
users          -- therapist accounts (id, email, password_hash)
clients        -- client profiles (id, user_id, name, age, gender, token_balance)
sessions       -- therapy sessions (id, client_id, goal_tokens, completed)
token_events   -- individual token awards (id, session_id, token_emoji, awarded_at)
rewards        -- reward catalog (id, client_id, name, cost, redeemed_at)
```

All foreign keys use `ON DELETE CASCADE`. Token awards and redemptions use database transactions to guarantee balance consistency.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a therapist account |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/clients` | Get all clients for logged-in therapist |
| POST | `/api/clients` | Create a new client |
| DELETE | `/api/clients/:id` | Delete a client |
| GET | `/api/clients/:id/bank` | Get client token bank |
| POST | `/api/sessions` | Start a new session |
| POST | `/api/sessions/:id/tokens` | Award a token to a session |
| PATCH | `/api/sessions/:id/complete` | Complete a session |
| GET | `/api/sessions/client/:id` | Get all sessions for a client |
| GET | `/api/rewards/client/:id` | Get active rewards for a client |
| POST | `/api/rewards` | Create a reward |
| POST | `/api/rewards/:id/redeem` | Redeem a reward |
| DELETE | `/api/rewards/:id` | Delete a reward |
| GET | `/api/analytics/client/:id` | Get client analytics |
| GET | `/api/analytics/overview` | Get therapist overview stats |

---

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/starlin-munoz/Token-Economy-System.git
cd Token-Economy-System
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
Token-Economy-System/
  frontend/
    src/
      api.js                  # centralized API call functions
      pages/
        TokenEconomy.jsx      # main therapy page
        Analytics.jsx         # therapist dashboard
        Login.jsx             # auth page
      components/
        AppHeader.jsx         # nav + header
        ClientProfile.jsx     # client management
        SelectToken.jsx       # token picker
        CurrentGoal.jsx       # session + token board
        RewardStore.jsx       # reward management
  backend/
    index.js                  # Express entry point
    db/
      index.js                # PostgreSQL connection pool
      schema.sql              # table definitions
    middleware/
      auth.js                 # JWT verification
    routes/
      auth.js                 # register + login
      clients.js              # client CRUD + bank
      sessions.js             # session + token events
      rewards.js              # reward CRUD + redemption
      analytics.js            # aggregated stats
```

---

## Clinical Background

This project was built from hands-on experience implementing ABA therapy as a Behavior Technician. Token economy systems are a standard evidence-based intervention in ABA, but most digital tools available to clinicians are either too generic or too expensive. This platform was designed to match how token economies actually work in 1:1 therapy sessions, with the workflow, terminology, and flexibility that real practitioners need.

---