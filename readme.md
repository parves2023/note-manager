# 🧠 K-Manager — Personal Task Management App
Live --- https://v0-taskapp-simple.vercel.app/

A minimal yet powerful task manager app built with modern web technologies. This project started as a Chakra UI-based app, but due to compatibility issues and styling limitations, I migrated to the more flexible and developer-friendly **ShadCN/UI** component library.

---

## 🚀 Tech Stack

- **Next.js 15** — App router & server actions support
- **TypeScript** — Type-safe development
- **Redux Toolkit** — Global state management
- **MongoDB** — Cloud database
- **ShadCN/UI** — Accessible and beautiful UI components
- **React DnD (via react-beautiful-dnd)** — Drag and drop task reordering
- **JWT** — User authentication

---

## 🌐 Live Features

- ✅ **Authentication**
  - Simple login & register flow 
  - Only two `.env` variables used (secure and minimal) MONGODB_URI
  - After clicking "Get Started", users are redirected to the login page



- ✅ **Task Board**
  - Tasks organized into three columns: `TODO`, `IN PROGRESS`, and `COMPLETED`
  - Tasks can be dragged and dropped across columns using `react-beautiful-dnd`

- ✅ **User Roles**
  - **Free Users:** Can add up to 10 tasks
  - **Premium Users:** Unlimited tasks allowed
    - To become premium, send me a friend request on Facebook:
      👉 [My Facebook Profile](https://www.facebook.com/profile.php?id=100055235052516)

- ✅ **Profile Page**
  - Shows task usage
  - Logout option

---

## 🛠️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/parves2023/note-manager
cd note-manager
add .env.local => MONGODB_URI