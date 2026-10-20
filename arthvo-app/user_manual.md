# Arthvo — User & Admin Manual

Welcome to Arthvo! This guide explains how to access and use the platform, including default credentials and login flows.

## 1. Running the Application

To start the application locally, open a terminal in the `arthvo-app` directory and run:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 2. Standard User Access (Simulated)

Arthvo currently uses a "simulated" backend using your browser's local storage to save your progress, XP, and avatar state. 

*   **Registration (`/register`):** You can enter any email and password. Since there is no real database connected yet, the app just saves a flag in your browser so you don't have to log in again.
*   **Login (`/login`):** If you open the app in an incognito window or clear your browser data, you can "log in" by simply entering any email/password. The app will let you back in and start you fresh if no local data is found.
*   **Profile Data:** Your name, age, income, and progress are saved locally. You can change your name and details in the **Profile** (`/profile`) tab.

## 3. Admin Panel Access

The Admin Panel is where you can configure the AI coaching engine, switch themes, and monitor system health. It is protected by a server-side verified password.

*   **Admin Login URL:** `http://localhost:3000/admin/login`
*   **Default Password:** `arthvo-admin-2025`

*(Note: In a production environment, you should change this password by setting the `ADMIN_PASSWORD` environment variable in your `.env.local` file).*

## 4. Configuring AI Features (OpenRouter)

To make the AI Coach and Bhavishya Score Report functional, you need an OpenRouter API Key:

1.  Log in to the Admin Panel (`/admin/login`).
2.  Go to the **AI Config** tab.
3.  Paste your OpenRouter API key into the **Primary API Key** field.
4.  (Optional) Click **Test Key** to verify it works.
5.  Click **Save Configuration**. The app will securely save this to a local configuration file so the AI features can read it.
6.  The **Chat Coach** (`/chat`) and **Bhavishya Score** (`/report`) pages will now use real AI models to respond to you.

## 5. Main Features to Explore

*   **Simulator (`/simulator`):** Test 5 different financial calculators (Corpus, Tax, Cost of Delay, Compare, Gig Worker).
*   **Journey (`/journey`):** View the Duolingo-style gamified progression path.
*   **Quests (`/quests`):** Complete daily financial literacy quizzes to earn XP.
*   **Home (`/home`):** See your daily streak, current Avatar State, and quick actions.
