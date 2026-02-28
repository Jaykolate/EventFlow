# Multi-Event Management Platform

A full-stack web application designed for organizing, managing, and registering for events. Supports user authentication, event creation, team formation, and notifications.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS (Minimalist Vercel-style Dark Theme), React Router v6, Axios, Recharts
- **Backend:** Django, Django REST Framework, PyMongo (direct driver for MongoDB), Custom JWT Auth, Django Channels (WebSockets)

## Project Structure
- `backend/`: Django API utilizing PyMongo for direct MongoDB operations and Channels for WebSockets.
- `frontend/`: React application styled with a strict, minimalist dark aesthetic.

---

## 🚀 Setup Instructions

### 1. Database (MongoDB)
- Create a MongoDB Atlas account or use a local MongoDB instance.
- In Atlas, create a new cluster and obtain your connection string.
- Replace `<username>` and `<password>` in the `.env` file with your database credentials.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Run migrations (to create collections in MongoDB):
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---
## 🔐 Default Roles
- **Organizer**: Can create events, manage registrations, send notifications.
- **Participant**: Can browse events, register, form/join teams.
