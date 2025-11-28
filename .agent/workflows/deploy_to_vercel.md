---
description: How to deploy the application to Vercel
---

# Deploy to Vercel

Vercel is the easiest way to deploy Next.js applications.

1.  **Create a Vercel Account**
    *   Go to [vercel.com](https://vercel.com) and sign up (you can use your GitHub account).

2.  **Install Vercel CLI (Optional but recommended)**
    *   Run `npm i -g vercel` in your terminal.

3.  **Deploy from Terminal**
    *   Run `npx vercel` in the project root directory.
    *   Follow the prompts:
        *   Set up and deploy? [Y]
        *   Which scope? [Select your account]
        *   Link to existing project? [N]
        *   Project name? [Press Enter for default]
        *   In which directory is your code located? [Press Enter for ./]
        *   Want to modify these settings? [N]

4.  **Deploy via GitHub (Alternative)**
    *   Push your code to a GitHub repository.
    *   Go to your Vercel dashboard.
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.
    *   Click "Deploy".

5.  **Share the Link**
    *   Once deployed, Vercel will give you a URL (e.g., `go-tutorial-tci.vercel.app`).
    *   You can share this link with anyone!
