# Odoo_Hackathon_2025

📘 StackIt – Minimal Q&A Forum Platform

Overview

StackIt is a professional, minimal Q&A platform supporting collaborative learning and structured knowledge sharing. It is designed with a modern, calm UI supporting light/dark mode, rich text editing, real-time notifications, and scalable architecture for hackathon and production readiness.

🚀 Features

✅ User Roles:

Guest: Browse questions and answers.

User: Register, login, post questions/answers, upvote/downvote, accept answers.

Admin: Moderate content, manage users, send announcements.

✅ Core Features:

Multi-page SPA with Landing Page, Auth Pages, Questions Feed, Ask Question, Question Detail, Profile, Admin Dashboard, Notifications, Tag Management, and Settings.

Rich Text Editor (bold, italic, strikethrough, lists, emoji, hyperlinks, image upload, alignment).

Real-time notifications using Socket.io for answers, comments, mentions.

Voting & accepted answers system.

Multi-select tagging and filtering.

Responsive, accessible UI with calm blue/navy/white/black palette.

Light & dark mode toggle.

Pagination and search for questions.

Image uploads in questions/answers.

✅ Admin Dashboard:

Approve/reject questions/answers.

Ban users.

View reports and logs.

🛠️ Tech Stack

Frontend: React + Vite + Tailwind CSS

Backend: Node.js + Express

Database: MongoDB

Auth: JWT

Rich Text Editor: React Quill

Real-time: Socket.io

Deployment: Vercel/Render/MongoDB Atlas (recommended)

🧩 Folder Structure

bash

/client   # React + Vite frontend
/server   # Node.js + Express backend
/README.md
/.env.example

🧑‍💻 Team Members
Ashmita Goyal 
Gargi Bajpai 
Lipika Tomar 

⚙️ Setup Instructions
1️⃣ Clone the repository:

git clone <repo-url>
cd stackit
2️⃣ Setup server:

cd server
npm install
npm run dev
3️⃣ Setup client:

cd client
npm install
npm run dev
4️⃣ Environment Variables:
Create .env files in both client and server folders using the provided .env.example.

🌐 Deployment
You can deploy the frontend on Vercel/Netlify and the backend on Render with MongoDB Atlas.
