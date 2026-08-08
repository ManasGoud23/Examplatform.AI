# 🚀 ExamPlatform.AI

## 🧠 AI-Powered Personalized Examination Platform

ExamPlatform.AI is an AI-powered examination platform that allows students to generate customized exams using AI, take assessments, receive instant results, and track their performance.

## ✨ Features

- 🔐 Secure user registration and login
- 📧 Email/Password authentication
- 🔵 Google authentication
- 🤖 AI-powered exam generation using Google Gemini
- 📚 Subject and topic-based exam generation
- 🎯 Difficulty-based question generation
- 📝 Interactive examination experience
- ⚡ Instant score calculation
- 📊 Performance tracking
- 📜 Exam history
- 👤 User-specific data
- ☁️ Cloud-based data storage
- 🛡️ Firestore Security Rules
- 📱 Responsive UI
- ✨ Smooth UI interactions and animations

## 🎯 Problem

Traditional examination platforms often depend on fixed question banks and provide limited customization.

Students may want to practice a specific subject, topic, difficulty level, or number of questions.

ExamPlatform.AI solves this by dynamically generating personalized exams using Generative AI.

## 💡 How It Works

```
User
 ↓
🔐 Firebase Authentication
 ↓
🏠 Dashboard
 ↓
⚙️ Select Exam Requirements
 ↓
🤖 Gemini AI
 ↓
📝 Generate Questions
 ↓
✍️ Take Exam
 ↓
📊 Calculate Score
 ↓
☁️ Firestore
 ↓
📈 Results & History
```

## 🛠️ Tech Stack

### Frontend
- ⚛️ React.js
- ⚡ Vite
- 🎨 Tailwind CSS
- 💻 JavaScript

### Backend / Cloud
- 🔥 Firebase
- 🔐 Firebase Authentication
- ☁️ Cloud Firestore
- 🛡️ Firestore Security Rules

### AI
- 🤖 Google Gemini API

### Version Control
- 🐙 Git
- 🐙 GitHub

## 🔥 Firebase

Firebase Authentication is used for:
- Email/Password login
- Google authentication
- User identity management

Cloud Firestore is used to store:
- 👤 Users
- 📝 Exams
- 📊 Results

Firestore Security Rules ensure users can only access authorized data.

## 🤖 AI Exam Generation

Users provide requirements such as:

- **Subject**: Java
- **Topic**: OOP
- **Difficulty**: Medium
- **Questions**: 10

Gemini AI dynamically generates questions based on those requirements.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Firebase project
- Gemini API access

### Clone

```bash
git clone https://github.com/RishithaKumbham/Examplatform.AI.git
cd Examplatform.AI
```

### Install

```bash
npm install
```

### Environment Variables

Create a local `.env` file.

Use the environment variable names required by the actual project:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

> ⚠️ **NEVER commit the real `.env` file.**

### Run

```bash
npm run dev
```

## 🏗️ Architecture

```
React + Vite
       ↓
Firebase Authentication
       ↓
Firebase UID
       ↓
Firestore

React
       ↓
Gemini API
       ↓
AI-generated Questions
```

Main Firestore collections:
- `users`
- `exams`
- `results`

## 🔐 Security

- Firebase Authentication handles user authentication.
- Passwords are managed by Firebase Authentication and are not stored in Firestore.
- Firebase UID is used to associate user data.
- Firestore Security Rules control access.
- Environment variables are used for configuration.
- `.env` must never be committed.

## 📈 Future Enhancements

- 🧠 AI-generated explanations
- 🎯 Adaptive difficulty
- 📚 Personalized study plans
- 📊 Advanced analytics
- 💬 AI study assistant
- 💻 Coding examinations
- 📄 PDF-based exam generation
- 👨‍🏫 Teacher/Admin dashboard
- 🏆 Leaderboards

## 👩‍💻 Contributors

- Manas Pandala
- Rishitha Kumbham

## ⭐ Project Vision

ExamPlatform.AI aims to make exam preparation more personalized, accessible, and intelligent by combining modern web technologies with Generative AI.
