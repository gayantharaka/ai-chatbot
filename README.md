## 🧠 AI Chatbot with Supabase & Angular

This is a full-stack AI-powered chatbot web application built using **Angular** (frontend), **Supabase** (authentication, database, edge functions), and **OpenAI** (for generating responses).

### ✨ Features

* 🔐 **Google Authentication** using Supabase Auth
* 💬 **Chat Interface** with persistent message history
* 🧠 **AI Assistant Responses** powered by OpenAI, triggered via Supabase Edge Functions
* ☁️ **Supabase Edge Functions** securely handle backend logic without exposing API keys to frontend
* 📦 **Messages stored in Supabase DB**, with user-based row-level security (RLS)
* 🔄 **Real-time chat feed**
* 🔓 **Session-aware messaging** (user messages only visible to the signed-in user)
* 🚪 **Clean sign-out flow** that clears local chat history
* 📄 **Static Pages** for About, Terms, and Privacy Policy

### 🧱 Tech Stack

* **Frontend:** Angular + Angular Material
* **Backend:** Supabase (DB + Auth + Edge Functions)
* **AI API:** OpenAI (via Supabase Function)
* **Database:** Supabase PostgreSQL with Row-Level Security (RLS)
* **Auth:** Supabase Auth with Google OAuth

Instructions to build this project are added in about.component.ts.


