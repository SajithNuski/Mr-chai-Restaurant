# Mr. Chai - Premium Restaurant Website

A premium, modern web application for **Mr. Chai**, a luxury tea house and street food restaurant. Built as a full-stack monorepo featuring a responsive React frontend, an Express backend, JWT authentication, a database with local JSON file fallback for resilience, and a complete Admin Dashboard to manage menu items, view customer inquiries, subscriptions, and track orders.

## 🔗 Live Demo
* **Deployed URL:** https://mr-chai-restaurant-g2ac.vercel.app

---

## ✨ Features

### 🍽️ Customer-facing Web App
* **Interactive Menu:** Filter menu items by category (Drinks, Street Eats, Delights) with spice levels and special badges.
* **Responsive Design:** Premium dark-themed UI optimized for mobile, tablet, and desktop screens.
* **Newsletter Signup:** Fast subscriptions with duplicate checking.
* **Contact & Inquiries:** Easy-to-use form to reach restaurant management.

### 🔐 Admin Dashboard
* **Secure Login:** Protected by JWT authentication and hashed credentials.
* **Real-time Metrics:** Insights on total orders, active menu items, customer feedback, and weekly order volume.
* **Menu Management (CRUD):** Add, edit, or delete menu items directly from the panel.
* **Inquiry Oversight:** View all submitted contact form messages.
* **Subscriber List:** Access all newsletter subscriber emails.
* **Order Tracking:** Track and monitor customer orders.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Vanilla CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose) with a local JSON file database fallback (`backend/local_db.json`) if MongoDB is offline.
* **Security:** JSON Web Tokens (JWT), bcryptjs
* **Deployment:** Vercel (monorepo structure)

---

## 📁 Project Structure

```text
├── api/                  # Vercel entrypoint (rewrites API calls to backend)
│   └── index.js          
├── backend/              # Express backend server
│   ├── server.js         # Main server logic, routing, and database fallback
│   ├── local_db.json     # Local JSON database fallback
│   └── package.json      
├── frontend/             # React SPA (Vite)
│   ├── src/              
│   │   ├── components/   # UI Sections & Admin Dashboard components
│   │   ├── App.jsx       
│   │   └── index.css     # Global premium stylesheet
│   └── package.json      
├── public/               # Built static frontend assets (compiled during build)
├── vercel.json           # Monorepo build and route configuration
└── package.json          # Root package.json with unified build script
```

---

## 🚀 Local Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/SajithNuski/Mr-chai-Restaurant.git
cd Mr-chai-Restaurant
```

### 2. Configure Environment Variables

#### Backend (`/backend/.env`)
Create a `.env` file inside the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_USER=admin
ADMIN_PASS=admin123
```
*Note: If MongoDB is not configured or fails to connect, the server automatically defaults to `backend/local_db.json` so the app keeps working.*

#### Frontend (`/frontend/.env`)
Create a `.env` file inside the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Locally

#### Start the Backend Server:
```bash
cd backend
npm install
npm start
```

#### Start the Frontend React App:
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment on Vercel

This repository is pre-configured to deploy seamlessly on Vercel as a single monorepo unit.

1. Import the project into Vercel.
2. The project's root `vercel.json` configures the build:
   - Root `npm run build` triggers building the frontend, then moves it to `/public`.
   - Incoming requests to `/api/*` are redirected to the Express server in `/api/index.js`.
   - Remaining requests serve the built React frontend from `/public/index.html`.
3. Add your environment variables (e.g. `MONGODB_URI`, `JWT_SECRET`, etc.) in Vercel's Project Settings.
