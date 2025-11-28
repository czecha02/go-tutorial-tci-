---
description: How to set up Git and push to GitHub
---

# Setup Git and Push to GitHub

Follow these steps to put your code on GitHub.

1.  **Initialize Git**
    *   Run `git init` in your project folder.
    *   Run `git add .` to stage all files.
    *   Run `git commit -m "Initial commit"` to save your changes.

2.  **Create a GitHub Repository**
    *   Go to [github.com/new](https://github.com/new).
    *   Enter a repository name (e.g., `go-tutorial-tci`).
    *   Make it **Public** or **Private**.
    *   **Do not** initialize with README, .gitignore, or license (you already have them).
    *   Click **Create repository**.

3.  **Connect and Push**
    *   Copy the commands under "…or push an existing repository from the command line".
    *   It will look like this:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/go-tutorial-tci.git
        git branch -M main
        git push -u origin main
        ```
    *   Run these commands in your terminal.

4.  **Deploy**
    *   Once on GitHub, you can easily deploy to Vercel by importing this repository.
