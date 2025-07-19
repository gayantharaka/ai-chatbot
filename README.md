## AI Chatbot with Supabase & Angular

This is a full-stack AI-powered chatbot web application built using **Angular** (frontend), **Supabase** (authentication, database, edge functions), and **OpenAI** (for generating responses).

### ✨ Features

* **Google Authentication** using Supabase Auth
* **Chat Interface** with persistent message history
* **AI Assistant Responses** powered by OpenAI, triggered via Supabase Edge Functions
* **Supabase Edge Functions** securely handle backend logic without exposing API keys to frontend
* **Messages stored in Supabase DB**, with user-based row-level security (RLS)
* **Real-time chat feed**
* **Session-aware messaging** (user messages only visible to the signed-in user)
* **Clean sign-out flow** that clears local chat history
* **Static Pages** for About, Terms, and Privacy Policy

### 🧱 Tech Stack

* **Frontend:** Angular + Angular Material
* **Backend:** Supabase (DB + Auth + Edge Functions)
* **AI API:** OpenAI (via Supabase Function)
* **Database:** Supabase PostgreSQL with Row-Level Security (RLS)
* **Auth:** Supabase Auth with Google OAuth

### ⚙️ Project Setup Instructions

Basic instructions to configure and run the project are provided in the `about.component.ts` file.

This includes:

* Setting up Supabase authentication with Google Sign-In
* Creating the chat message table and RLS policies in Supabase
* Deploying the Edge Function to handle OpenAI API integration
* Adding required environment variables and secrets

Refer to that file for step-by-step guidance to fully configure the Supabase backend and connect it with the Angular frontend.


