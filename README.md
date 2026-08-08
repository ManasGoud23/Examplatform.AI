# 🚀 ExamPlatform.AI

## 🧠 AI-Powered Personalized Examination Platform

A modern AI-powered examination platform that allows students to generate customized exams using AI, take assessments, receive instant results, and track their performance.

---

## ✨ Features

* 🔐 Secure user registration and login
* 🔑 Email/Password authentication
* 🔵 Google authentication
* 🤖 AI-powered exam generation using Google Gemini
* 📚 Custom exams based on subject/topic
* 🎯 Difficulty-based question generation
* 📝 Interactive exam experience
* ⚡ Instant score calculation
* 📊 Performance tracking
* 📜 Exam history
* 👤 User-specific data
* ☁️ Cloud-based data storage
* 🛡️ Firebase Firestore Security Rules
* 📱 Responsive and modern UI
* ✨ Smooth UI interactions and animations

---

## 🎯 Problem

Traditional examination platforms often depend on fixed question banks and provide limited customization.

Students may want to practice:

* A specific subject
* A specific topic
* A particular difficulty level
* A specific number of questions

ExamPlatform.AI solves this by dynamically generating personalized exams using AI.

---

## 💡 How It Works

```text
👤 User
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
📈 Results & Performance History
```

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js
* ⚡ Vite
* 🎨 Tailwind CSS
* 💻 JavaScript

### Backend / Cloud

* 🔥 Firebase
* 🔐 Firebase Authentication
* ☁️ Cloud Firestore
* 🛡️ Firestore Security Rules

### AI

* 🤖 Google Gemini API

### Development

* 🐙 Git
* 🐙 GitHub

---

## 🏗️ Architecture

```text
                    ExamPlatform.AI
                           │
                     React + Vite
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
    Firebase Authentication        Gemini AI
             │                           │
             ▼                           ▼
       Firebase UID              AI Generated Questions
             │
             ▼
         Firestore
       ┌─────┼─────┐
       │     │     │
     users exams results
```

---

## 🔥 Firebase

Firebase is used for authentication, cloud data storage, and access control.

### Authentication

* Email/Password
* Google Sign-In

### Firestore Collections

```text
users
exams
results
```

Each user's application data is associated with their Firebase UID.

Firestore Security Rules ensure users can only access authorized data.

---

## 🤖 AI Exam Generation

Users provide exam requirements such as:

```text
Subject: Java
Topic: OOP
Difficulty: Medium
Questions: 10
```

The application sends these requirements to Gemini AI, which generates the examination questions dynamically.

This removes the dependency on a completely static question bank.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* Firebase project
* Gemini API access

### 1. Clone the repository

```bash
git clone https://github.com/ManasGoud23/Examplatform.AI.git
cd Examplatform.AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Use the environment variable names already defined in the project.

Do NOT commit `.env` to GitHub.

Example:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite.

---

## 🔐 Security

* Firebase Authentication handles user authentication.
* Passwords are not stored in Firestore.
* Firestore Security Rules protect user data.
* Environment variables are used for configuration.
* `.env` must never be committed to GitHub.

---

## 📁 Project Structure

```text
ExamPlatform.AI/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── common/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── Timer.jsx
│   │   └── layout/
│   │       ├── Footer.jsx
│   │       └── Navbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── firebase/
│   │   ├── config.js
│   │   └── firebaseHelpers.js
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── ExamScreenPage.jsx
│   │   ├── GenerateExamPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ResultsPage.jsx
│   │   └── SignupPage.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── examService.js
│   │   ├── geminiService.js
│   │   ├── resultService.js
│   │   └── userService.js
│   ├── utils/
│   │   └── animationVariants.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── firestore.rules
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 📈 Future Enhancements

* 🧠 AI-generated explanations
* 🎯 Adaptive difficulty
* 📚 Personalized study plans
* 📊 Advanced performance analytics
* 💬 AI study assistant
* 📝 More question types
* 💻 Coding examinations
* 📄 PDF-based exam generation
* 👨‍🏫 Teacher/Admin dashboard
* 🏆 Leaderboards

---

## 👨‍💻 Author

**Manas Pandala**

GitHub:
https://github.com/ManasGoud23

---

## ⭐ Project Vision

ExamPlatform.AI aims to make exam preparation more personalized, accessible, and intelligent by combining modern web technologies with Generative AI.

If you find the project useful, consider giving it a ⭐ on GitHub.
